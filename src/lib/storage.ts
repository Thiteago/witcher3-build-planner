import { CUSTOM_BUILD_SCHEMA_VERSION, type CustomBuild } from './types';

const STORAGE_KEY = 'tw3-builder:custom-builds:v1';

function isCustomBuildShape(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

/**
 * Single seam for future schema changes: given whatever was parsed out of
 * localStorage, either return a valid CustomBuild or null to drop it.
 */
function migrateBuild(raw: unknown): CustomBuild | null {
	if (!isCustomBuildShape(raw)) return null;
	if (raw.schemaVersion !== CUSTOM_BUILD_SCHEMA_VERSION) return null;
	if (typeof raw.id !== 'string' || typeof raw.name !== 'string') return null;
	return raw as unknown as CustomBuild;
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
