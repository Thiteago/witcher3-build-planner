import type { SkillTier } from '../types';

/**
 * Ability points required to already be spent in a category tree before its
 * next tier unlocks. CONFIRMED from game data (gameplay/abilities/
 * geralt_skills.xml, attribute requiredPointsSpent = 0/6/12/18) — see
 * game_data/skills_official.json.
 */
export const TIER_POINT_THRESHOLDS: Record<SkillTier, number> = { 1: 0, 2: 6, 3: 12, 4: 18 };

/** Highest tier unlocked in a tree given how many points are already spent in it. */
export function tierUnlockedByPoints(pointsSpentInTree: number): SkillTier {
	if (pointsSpentInTree >= TIER_POINT_THRESHOLDS[4]) return 4;
	if (pointsSpentInTree >= TIER_POINT_THRESHOLDS[3]) return 3;
	if (pointsSpentInTree >= TIER_POINT_THRESHOLDS[2]) return 2;
	return 1;
}

/**
 * CONFIRMED from game data (gameplay/abilities/geralt_levelups.xml):
 * addedSkillPoints=1 per level from level 2 on (level 1 grants 0), including
 * the "infinite levels" past 50. Bonus points from Places of Power are
 * intentionally not counted here.
 */
export function abilityPointsAtLevel(level: number): number {
	return Math.max(0, level - 1);
}

/**
 * CONFIRMED from game data (geralt_skills.xml <skill_slots>): a single shared
 * pool of 12 generic skill slots (any skill in any slot), in 4 groups of 3 —
 * each group shares one mutagen slot. Slots 13-16 (group 5) unlock via Blood
 * and Wine mutation research (see MUTATION_SLOT_UNLOCKS_BY_RESEARCHED_COUNT)
 * and are not modeled in the planner yet.
 */
export const SKILL_SLOT_COUNT = 12;
export const SLOT_GROUP_SIZE = 3;
export const SLOT_GROUP_COUNT = SKILL_SLOT_COUNT / SLOT_GROUP_SIZE;

/** Character level at which each of the 12 skill slots unlocks (slot 1 is available from the start). */
export const SKILL_SLOT_UNLOCK_LEVELS = [1, 2, 4, 6, 8, 10, 12, 15, 18, 22, 26, 30];

/** Number of skill slots unlocked at a given character level. */
export function skillSlotsUnlockedAtLevel(level: number): number {
	return SKILL_SLOT_UNLOCK_LEVELS.filter((unlockLevel) => level >= unlockLevel).length;
}

/**
 * Character level at which each of the 4 mutagen slots unlocks. CONFIRMED
 * from game data (geralt_skills.xml <mutagen_slots unlockedAtLevel>):
 * 2, 9, 16, 28 — the first slot opens at level 2, not 3.
 */
export const MUTAGEN_SLOT_UNLOCKS = [2, 9, 16, 28];

/**
 * Total researched Blood and Wine mutations required to unlock each of the 4
 * extra skill slots. CONFIRMED from game data (DLC bob geralt_mutations.xml,
 * mutationsRequiredForSlot1..4 = 2/4/8/12).
 */
export const MUTATION_SLOT_UNLOCKS_BY_RESEARCHED_COUNT = [2, 4, 8, 12];

/** Number of mutagen slots unlocked at a given character level. */
export function mutagenSlotsUnlockedAtLevel(level: number): number {
	return MUTAGEN_SLOT_UNLOCKS.filter((unlockLevel) => level >= unlockLevel).length;
}

/** Number of Blood and Wine mutation slots unlocked given a count of researched mutations. */
export function mutationSlotsUnlockedByResearchedCount(researchedCount: number): number {
	return MUTATION_SLOT_UNLOCKS_BY_RESEARCHED_COUNT.filter(
		(threshold) => researchedCount >= threshold
	).length;
}
