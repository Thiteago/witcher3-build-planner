#!/usr/bin/env python3
"""Build game_data/skills_official.json from geralt_skills.xml + decoded w3strings."""
import json, re, sys

SCRATCH = '/tmp/claude-1002/-home-thiago-workspaces-pessoais-hobby-the-witcher-3-building/75443891-8677-4724-8fc3-c807e5a0bd06/scratchpad'
REPO = '/home/thiago/workspaces/pessoais-hobby/the_witcher_3_building'

en = json.load(open(f'{SCRATCH}/en.json'))
br = json.load(open(f'{SCRATCH}/br.json'))

# game skill id -> str_id of its English name (identified by matching ability
# stat modifiers in geralt_skills.xml against official skill descriptions)
NAME_IDS = {
    # Combat (Sword)
    'sword_s21': 1066845, 'sword_s17': 1066841, 'sword_s1': 1066825, 'sword_s5': 1066829,
    'sword_s4': 1066828, 'sword_s8': 1066832, 'sword_s2': 1066826, 'sword_s6': 1066830,
    'sword_s10': 1066834, 'sword_s9': 1066833, 'sword_s11': 1066835, 'sword_s3': 1066827,
    'sword_s13': 1066837, 'sword_s15': 1066839, 'sword_s7': 1066831, 'sword_s12': 1066836,
    'sword_s16': 1066840, 'sword_s18': 1066842, 'sword_s20': 1066844, 'sword_s19': 1066843,
    # Signs (Magic)
    'magic_s20': 1066870, 'magic_s1': 1066851, 'magic_s12': 1066862, 'magic_s6': 1066856,
    'magic_s8': 1066857, 'magic_s2': 1066852, 'magic_s7': 1066858, 'magic_s9': 1066859,
    'magic_s10': 1066860, 'magic_s3': 1066853, 'magic_s16': 1066866, 'magic_s11': 1066861,
    'magic_s13': 1066863, 'magic_s4': 1066854, 'magic_s15': 1066865, 'magic_s14': 1066864,
    'magic_s17': 1066867, 'magic_s5': 1066855, 'magic_s18': 1066868, 'magic_s19': 1066869,
    # Alchemy
    'alchemy_s1': 1066877, 'alchemy_s2': 1066878, 'alchemy_s3': 1066879, 'alchemy_s4': 1066880,
    'alchemy_s12': 1066889, 'alchemy_s5': 1066881, 'alchemy_s6': 1066882, 'alchemy_s7': 1066883,
    'alchemy_s9': 1066885, 'alchemy_s10': 1066886, 'alchemy_s8': 1066884, 'alchemy_s11': 1066887,
    'alchemy_s18': 1066894, 'alchemy_s13': 1066888, 'alchemy_s19': 1066895, 'alchemy_s14': 1066890,
    'alchemy_s16': 1066892, 'alchemy_s20': 1066896, 'alchemy_s15': 1066891, 'alchemy_s17': 1066893,
    # General (Perks)
    'perk_1': 1066898, 'perk_2': 1066899, 'perk_4': 1066901, 'perk_5': 1066902,
    'perk_6': 1066903, 'perk_7': 1066904, 'perk_9': 1066906, 'perk_10': 1066907,
    'perk_11': 1066908, 'perk_12': 1066909,
}

PATH_TO_CATEGORY = {'Sword': 'combat', 'Signs': 'signs', 'Alchemy': 'alchemy', 'Perks': 'general'}
TIERS = {0: 1, 6: 2, 12: 3, 18: 4}

text = open(f'{REPO}/game_data/geralt_skills.xml').read()
custom = text[text.index('<custom>'):]
no_comments = re.sub(r'<!--.*?-->', '', custom, flags=re.S)

skills = []
for m in re.finditer(r'<skill\s+([^>]*?)/?>', no_comments):
    attrs = dict(re.findall(r'(\w+)="([^"]*)"', m.group(1)))
    gid = attrs.get('skill_name')
    if attrs.get('isCoreSkill') or gid not in NAME_IDS:
        continue
    sid = NAME_IDS[gid]
    entry = {
        'gameId': gid,
        'nameEn': en[str(sid)][1],
        'nameBr': br[str(sid)][1],
        'category': PATH_TO_CATEGORY[attrs['pathType_name']],
        'column': attrs['subpathType_name'],
        'tier': TIERS[int(attrs.get('requiredPointsSpent', 0))],
        'maxRank': int(attrs.get('maxLevel', 1)),
    }
    skills.append(entry)

# sanity: en/br names must exist and no duplicates
names = [s['nameEn'] for s in skills]
assert len(names) == len(set(names)), 'duplicate names'
assert len(skills) == 70, f'expected 70 skills, got {len(skills)}'

out = {
    'source': 'gameplay/abilities/geralt_skills.xml (custom/skills, GeraltSkills) + en/br.w3strings, Witcher 3 Next-Gen (Steam, jul/2026)',
    'tierThresholds': {'1': 0, '2': 6, '3': 12, '4': 18},
    'skillSlots': {'levels': [1, 2, 4, 6, 8, 10, 12, 15, 18, 22, 26, 30], 'model': 'pool unico de 12 slots genericos, 4 grupos de 3; slots 13-16 desbloqueados via mutacoes (B&W)'},
    'mutagenSlotLevels': [2, 9, 16, 28],
    'skills': skills,
}
json.dump(out, open(f'{REPO}/game_data/skills_official.json', 'w'), ensure_ascii=False, indent=2)
print(f'wrote {len(skills)} skills')
for s in skills:
    print(f"{s['gameId']:12} {s['category']:8} {s['column']:22} T{s['tier']} max{s['maxRank']}  {s['nameEn']:26} | {s['nameBr']}")
