import { tierUnlockedByPoints, abilityPointsAtLevel } from '../data/slotProgression';
import type { CustomBuild, EquippedSlots, Skill, SkillCategory } from '../types';

export function pointsSpentInCategory(
	build: CustomBuild,
	category: SkillCategory,
	skillsById: Map<string, Skill>
): number {
	return build.learnedSkills.reduce((total, inv) => {
		const skill = skillsById.get(inv.skillId);
		return skill && skill.category === category ? total + inv.rank : total;
	}, 0);
}

export function totalPointsSpent(build: CustomBuild): number {
	return build.learnedSkills.reduce((total, inv) => total + inv.rank, 0);
}

export function remainingPoints(build: CustomBuild): number {
	return abilityPointsAtLevel(build.level) - totalPointsSpent(build);
}

/** Whether a skill's tier is currently unlocked given points already spent in its category (excluding itself). */
export function isSkillUnlocked(
	build: CustomBuild,
	skill: Skill,
	skillsById: Map<string, Skill>
): boolean {
	const currentRank = build.learnedSkills.find((inv) => inv.skillId === skill.id)?.rank ?? 0;
	const spentExcludingThis = pointsSpentInCategory(build, skill.category, skillsById) - currentRank;
	return tierUnlockedByPoints(spentExcludingThis) >= skill.tier;
}

export function rankOf(build: CustomBuild, skillId: string): number {
	return build.learnedSkills.find((inv) => inv.skillId === skillId)?.rank ?? 0;
}

/** Sets a skill's invested rank (0 unlearns it, and unequips it from any slot it occupied). */
export function withSkillRank(
	build: CustomBuild,
	skill: Skill,
	rank: number
): Partial<CustomBuild> {
	const clamped = Math.max(0, Math.min(skill.maxRank, rank));
	const learnedSkills = build.learnedSkills.filter((inv) => inv.skillId !== skill.id);
	if (clamped > 0) learnedSkills.push({ skillId: skill.id, rank: clamped });

	let equipped = build.equipped;
	if (clamped === 0) {
		equipped = unequipSkillEverywhere(build.equipped, skill.id);
	}
	return { learnedSkills, equipped };
}

function unequipSkillEverywhere(equipped: EquippedSlots, skillId: string): EquippedSlots {
	return equipped.map((s) => (s === skillId ? null : s));
}

export function withEquippedSlot(
	build: CustomBuild,
	slotIndex: number,
	skillId: string | null
): EquippedSlots {
	// A skill can only occupy one slot at a time.
	const next = skillId ? unequipSkillEverywhere(build.equipped, skillId) : [...build.equipped];
	next[slotIndex] = skillId;
	return next;
}

export function emptyEquippedSlots(slotCount: number): EquippedSlots {
	return Array(slotCount).fill(null);
}
