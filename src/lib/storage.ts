import { CUSTOM_BUILD_SCHEMA_VERSION, type CustomBuild, type Mutation, type Skill } from './types';
import { SKILL_SLOT_COUNT, SLOT_GROUP_SIZE } from './data/slotProgression';
import skillsData from './data/skills.json';
import mutationsData from './data/mutations.json';

const STORAGE_KEY = 'tw3-builder:custom-builds:v2';

const skillsById = new Map((skillsData as Skill[]).map((s) => [s.id, s]));
const mutationIds = new Set((mutationsData as Mutation[]).map((m) => m.id));

function isCustomBuildShape(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

/**
 * v2 -> v3: the equip model changed from 3 slots per color to the game's real
 * single pool of 12 generic slots (4 groups of 3). Old per-color slots map
 * onto groups in tree order (red -> group 1, blue -> 2, green -> 3,
 * none -> 4). Skill ids that no longer exist (the v2 dataset had skills that
 * aren't in the game) are dropped, and ranks are clamped to the real maxRank.
 */
function migrateV2ToV3(raw: Record<string, unknown>): Record<string, unknown> {
	const oldEquipped = (raw.equipped ?? {}) as Record<string, (string | null)[]>;
	const equipped: (string | null)[] = Array(SKILL_SLOT_COUNT).fill(null);
	(['red', 'blue', 'green', 'none'] as const).forEach((color, group) => {
		(oldEquipped[color] ?? []).slice(0, SLOT_GROUP_SIZE).forEach((skillId, i) => {
			if (skillId && skillsById.has(skillId)) equipped[group * SLOT_GROUP_SIZE + i] = skillId;
		});
	});

	const learnedSkills = (Array.isArray(raw.learnedSkills) ? raw.learnedSkills : [])
		.filter(
			(inv): inv is { skillId: string; rank: number } =>
				isCustomBuildShape(inv) && typeof inv.skillId === 'string' && typeof inv.rank === 'number'
		)
		.flatMap((inv) => {
			const skill = skillsById.get(inv.skillId);
			if (!skill) return [];
			return [{ skillId: inv.skillId, rank: Math.max(1, Math.min(skill.maxRank, inv.rank)) }];
		});

	return { ...raw, schemaVersion: 3, equipped, learnedSkills };
}

/**
 * v3 -> v4: the mutation dataset was regenerated from the official game data;
 * two ids that don't exist in the game ("cyclone", "symbiosis") were removed.
 */
function migrateV3ToV4(raw: Record<string, unknown>): Record<string, unknown> {
	const mutation =
		typeof raw.mutation === 'string' && mutationIds.has(raw.mutation) ? raw.mutation : null;
	return { ...raw, schemaVersion: 4, mutation };
}

/**
 * Single seam for future schema changes: given whatever was parsed out of
 * localStorage, either return a valid CustomBuild or null to drop it.
 */
function migrateBuild(raw: unknown): CustomBuild | null {
	if (!isCustomBuildShape(raw)) return null;
	let build = raw;
	if (build.schemaVersion === 2) build = migrateV2ToV3(build);
	if (build.schemaVersion === 3) build = migrateV3ToV4(build);
	if (build.schemaVersion !== CUSTOM_BUILD_SCHEMA_VERSION) return null;
	if (typeof build.id !== 'string' || typeof build.name !== 'string') return null;
	return build as unknown as CustomBuild;
}

export function loadBuilds(): CustomBuild[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.map(migrateBuild).filter((b): b is CustomBuild => b !== null);
	} catch (error) {
		console.warn('Failed to load custom builds from localStorage', error);
		return [];
	}
}

export function saveBuilds(builds: CustomBuild[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
	} catch (error) {
		console.warn('Failed to save custom builds to localStorage', error);
	}
}
