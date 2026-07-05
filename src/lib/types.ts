export type SkillCategory = 'combat' | 'signs' | 'alchemy' | 'general';

/** Skill tree slot color: red = combat, blue = signs, green = alchemy, none = general (no adjacency bonus) */
export type SlotColor = 'red' | 'blue' | 'green' | 'none';

/** Which of the 4 tiers within its category tree this skill belongs to (gates when it can be learned). */
export type SkillTier = 1 | 2 | 3 | 4;

export interface Skill {
	id: string;
	/** Internal id in the game files (see game_data/skills_official.json). */
	gameId: string;
	name: string;
	category: SkillCategory;
	color: SlotColor;
	description: string;
	tier: SkillTier;
	maxRank: number;
	requiresDLC?: 'blood-and-wine' | 'hearts-of-stone';
}

export type GearSchool = 'wolven' | 'griffin' | 'cat' | 'ursine' | 'manticore';

export interface GearTier {
	name: string;
	order: number;
}

export interface SetBonus {
	piecesRequired: number;
	description: string;
}

export interface GearSet {
	id: string;
	name: string;
	school: GearSchool;
	playstyle: string;
	tiers: GearTier[];
	setBonuses?: SetBonus[];
	requiresDLC?: 'blood-and-wine';
}

export interface Mutagen {
	id: string;
	name: string;
	color: SlotColor;
	rarity: 'lesser' | 'greater';
	effect: string;
}

export interface Mutation {
	id: string;
	name: string;
	color: SlotColor | 'multi';
	description: string;
	requiresDLC: 'blood-and-wine';
}

export type ItemType = 'rune' | 'glyph' | 'oil' | 'potion' | 'decoction';

export interface GenericItem {
	id: string;
	name: string;
	type: ItemType;
	effect: string;
	requiresDLC?: 'blood-and-wine';
}

export type CuratedBuildFocus = 'sign' | 'alchemy' | 'combat-fast' | 'combat-strong' | 'hybrid';
export type CuratedBuildRole = 'damage' | 'survivability' | 'crowd-control';
export type CuratedBuildStage = 'early-game' | 'mid-game' | 'late-game' | 'ng-plus';
export type CuratedBuildRequires = 'base-game' | 'blood-and-wine';

export type CuratedBuildTag =
	| `focus:${CuratedBuildFocus}`
	| `role:${CuratedBuildRole}`
	| `stage:${CuratedBuildStage}`
	| `requires:${CuratedBuildRequires}`
	| `gear:${GearSchool}`;

export interface CuratedBuild {
	id: string;
	name: string;
	tags: CuratedBuildTag[];
	description: string;
	skills: string[];
	gearSchool: GearSchool;
	mutation?: string;
	decoctions?: string[];
	difficulty: 'easy' | 'moderate' | 'advanced';
}

export const CUSTOM_BUILD_SCHEMA_VERSION = 3 as const;

export const MUTAGEN_SLOT_COUNT = 4;

/** A skill the player has invested ability points into (learned), independent of whether it's equipped. */
export interface SkillInvestment {
	skillId: string;
	rank: number;
}

/**
 * The 12 generic equip slots, as in the game: any learned skill can go in any
 * slot. Slots form 4 groups of 3 (indexes 0-2, 3-5, 6-8, 9-11); each group
 * shares one mutagen slot, whose bonus scales with skills of matching color
 * in the group.
 */
export type EquippedSlots = (string | null)[];

export interface CustomBuild {
	schemaVersion: typeof CUSTOM_BUILD_SCHEMA_VERSION;
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	level: number;
	learnedSkills: SkillInvestment[];
	equipped: EquippedSlots;
	mutagens: (string | null)[];
	mutation: string | null;
	gearSchool: GearSchool | null;
	decoctions: string[];
	notes?: string;
}
