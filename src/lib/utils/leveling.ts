import { ABILITY_SLOT_UNLOCKS } from '../data/slotProgression';
import type { Skill } from '../types';

export interface LevelingStep {
	level: number;
	skill: Skill | null;
}

/**
 * Zips a build's ordered skill picks with the levels at which each ability
 * slot unlocks, producing a "at level X, pick skill Y" leveling guide.
 */
export function buildLevelingSequence(
	skillIds: readonly (string | null | undefined)[],
	allSkills: readonly Skill[]
): LevelingStep[] {
	return ABILITY_SLOT_UNLOCKS.map((level, i) => ({
		level,
		skill: allSkills.find((s) => s.id === skillIds[i]) ?? null
	}));
}
