/**
 * Character level at which each of the 12 ability slots unlocks.
 * Approximate progression based on community build guides, not an exact
 * per-level dump of the game's XML data.
 */
export const ABILITY_SLOT_UNLOCKS = [2, 3, 4, 6, 8, 10, 12, 15, 18, 22, 26, 30];

/** Character level at which each of the 4 mutagen slots unlocks. */
export const MUTAGEN_SLOT_UNLOCKS = [3, 9, 16, 28];

/** Total researched Blood and Wine mutations required to unlock each of the 4 mutation slots. */
export const MUTATION_SLOT_UNLOCKS_BY_RESEARCHED_COUNT = [2, 4, 8, 12];

/** Number of ability slots unlocked at a given character level. */
export function abilitySlotsUnlockedAtLevel(level: number): number {
	return ABILITY_SLOT_UNLOCKS.filter((unlockLevel) => level >= unlockLevel).length;
}

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
