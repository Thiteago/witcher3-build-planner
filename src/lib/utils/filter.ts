/** Groups namespaced tags like "focus:sign" by their prefix ("focus"). */
export function groupTagsByPrefix(tags: readonly string[]): Record<string, string[]> {
	const groups: Record<string, string[]> = {};
	for (const tag of tags) {
		const [group] = tag.split(':');
		(groups[group] ??= []).push(tag);
	}
	for (const group of Object.values(groups)) {
		group.sort();
	}
	return groups;
}

/** True if itemTags contains every tag currently selected (AND semantics across groups). */
export function matchesAllTags(itemTags: readonly string[], selected: readonly string[]): boolean {
	return selected.every((tag) => itemTags.includes(tag));
}

export function matchesSearch(text: string, query: string): boolean {
	if (!query.trim()) return true;
	return text.toLowerCase().includes(query.trim().toLowerCase());
}
