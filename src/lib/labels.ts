import type { Skill } from './types';

export const skillCategoryLabel: Record<Skill['category'], string> = {
	combat: 'Combate',
	signs: 'Signos',
	alchemy: 'Alquimia',
	general: 'Geral'
};

export const skillColorLabel: Record<Skill['color'], string> = {
	red: 'Combate',
	blue: 'Signos',
	green: 'Alquimia',
	none: 'Geral'
};
