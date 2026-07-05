import { abilityPointsAtLevel, tierUnlockedByPoints } from '../data/slotProgression';
import type { Skill } from '../types';

export interface LevelingStep {
	level: number;
	skill: Skill;
	rank: number;
}

/**
 * Simulates spending ability points level by level (1 point/level, see
 * abilityPointsAtLevel) on the given skills in the given priority order,
 * respecting each skill's tier gate (points already spent in its category).
 * A skill later in the list can "jump the queue" and get points before an
 * earlier one if the earlier one's tier isn't unlocked yet — this mirrors
 * how a real player would actually be forced to spend points in practice.
 */
export function simulateLevelingSequence(
	orderedSkillIds: readonly string[],
	allSkills: readonly Skill[]
): LevelingStep[] {
	const queue: Skill[] = [];
	for (const id of orderedSkillIds) {
		const skill = allSkills.find((s) => s.id === id);
		if (!skill) continue;
		for (let r = 0; r < skill.maxRank; r++) queue.push(skill);
	}

	const pointsSpentByCategory: Partial<Record<Skill['category'], number>> = {};
	const rankBySkill: Record<string, number> = {};
	const steps: LevelingStep[] = [];

	let level = 1;
	let banked = 0;
	let previousAvailable = abilityPointsAtLevel(level);

	while (queue.length > 0 && level < 100) {
		level++;
		const available = abilityPointsAtLevel(level);
		banked += available - previousAvailable;
		previousAvailable = available;

		while (banked > 0 && queue.length > 0) {
			const index = queue.findIndex((candidate) => {
				const spent = pointsSpentByCategory[candidate.category] ?? 0;
				return tierUnlockedByPoints(spent) >= candidate.tier;
			});
			if (index === -1) break;

			const skill = queue[index];
			queue.splice(index, 1);
			banked -= 1;
			pointsSpentByCategory[skill.category] = (pointsSpentByCategory[skill.category] ?? 0) + 1;
			rankBySkill[skill.id] = (rankBySkill[skill.id] ?? 0) + 1;
			steps.push({ level, skill, rank: rankBySkill[skill.id] });
		}
	}

	return steps;
}
