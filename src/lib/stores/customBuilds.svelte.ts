import { browser } from '$app/environment';
import { loadBuilds, saveBuilds } from '../storage';
import { emptyEquippedSlots } from '../utils/economy';
import { SKILL_SLOT_COUNT } from '../data/slotProgression';
import { CUSTOM_BUILD_SCHEMA_VERSION, MUTAGEN_SLOT_COUNT, type CustomBuild } from '../types';

function createCustomBuildsStore() {
	let builds = $state<CustomBuild[]>(browser ? loadBuilds() : []);

	function persist() {
		if (browser) saveBuilds(builds);
	}

	function create(name: string, seed?: Partial<CustomBuild>): CustomBuild {
		const now = new Date().toISOString();
		const build: CustomBuild = {
			schemaVersion: CUSTOM_BUILD_SCHEMA_VERSION,
			id: crypto.randomUUID(),
			name,
			createdAt: now,
			updatedAt: now,
			level: 1,
			learnedSkills: [],
			equipped: emptyEquippedSlots(SKILL_SLOT_COUNT),
			mutagens: Array(MUTAGEN_SLOT_COUNT).fill(null),
			mutation: null,
			gearSchool: null,
			decoctions: [],
			...seed
		};
		builds = [...builds, build];
		persist();
		return build;
	}

	function update(id: string, patch: Partial<CustomBuild>) {
		builds = builds.map((b) =>
			b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b
		);
		persist();
	}

	function duplicate(id: string): CustomBuild | null {
		const source = builds.find((b) => b.id === id);
		if (!source) return null;
		return create(`${source.name} (cópia)`, {
			level: source.level,
			learnedSkills: source.learnedSkills.map((inv) => ({ ...inv })),
			equipped: [...source.equipped],
			mutagens: [...source.mutagens],
			mutation: source.mutation,
			gearSchool: source.gearSchool,
			decoctions: [...source.decoctions],
			notes: source.notes
		});
	}

	function remove(id: string) {
		builds = builds.filter((b) => b.id !== id);
		persist();
	}

	function get(id: string): CustomBuild | undefined {
		return builds.find((b) => b.id === id);
	}

	return {
		get all() {
			return builds;
		},
		create,
		update,
		duplicate,
		remove,
		get
	};
}

export const customBuilds = createCustomBuildsStore();
