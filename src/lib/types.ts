export type SkillCategory = 'combat' | 'signs' | 'alchemy' | 'general';

/** Skill tree slot color: red = combat, blue = signs, green = alchemy, none = general (no adjacency bonus) */
export type SlotColor = 'red' | 'blue' | 'green' | 'none';

export interface Skill {
	id: string;
	name: string;
	category: SkillCategory;
	color: SlotColor;
	description: string;
	requiresDLC?: 'blood-and-wine';
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

export const CUSTOM_BUILD_SCHEMA_VERSION = 1 as const;

export const ABILITY_SLOT_COUNT = 12;
export const MUTAGEN_SLOT_COUNT = 4;

export interface CustomBuild {
	schemaVersion: typeof CUSTOM_BUILD_SCHEMA_VERSION;
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	level: number;
	skills: (string | null)[];
	mutagens: (string | null)[];
	mutation: string | null;
	gearSchool: GearSchool | null;
	decoctions: string[];
	notes?: string;
}
