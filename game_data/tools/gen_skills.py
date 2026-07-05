#!/usr/bin/env python3
"""Regenerate src/lib/data/skills.json from game_data/skills_official.json.

App ids are kept where a skill already existed; new skills get kebab-case ids
derived from the official English name. Names use the official PT-BR
localization; descriptions are hand-written PT-BR based on the official
descriptions + ability stat values from geralt_skills.xml.
"""
import json

REPO = '/home/thiago/workspaces/pessoais-hobby/the_witcher_3_building'
official = json.load(open(f'{REPO}/game_data/skills_official.json'))
by_gid = {s['gameId']: s for s in official['skills']}

CAT_COLOR = {'combat': 'red', 'signs': 'blue', 'alchemy': 'green', 'general': 'none'}

# appId, gameId, PT-BR description
TABLE = [
    # ---- Combate (Sword) — Ataque Rápido
    ('muscle-memory', 'sword_s21', 'Aumenta o dano dos ataques rápidos em 10% por ranque.'),
    ('precise-blows', 'sword_s17', 'Aumenta a chance de acerto crítico com ataques rápidos em 4% e o dano crítico desses ataques em 25% por ranque.'),
    ('whirl', 'sword_s1', 'Habilidade ativa: ataque giratório que atinge todos os inimigos ao redor. Manter o giro consome Vigor e Adrenalina.'),
    ('crippling-strikes', 'sword_s5', 'Ataques rápidos também aplicam Sangramento, drenando a Vitalidade ou Essência do alvo por alguns segundos.'),
    # ---- Combate — Ataque Forte
    ('strength-training', 'sword_s4', 'Aumenta o dano dos ataques fortes em 10% por ranque.'),
    ('crushing-blows', 'sword_s8', 'Aumenta a chance de acerto crítico com ataques fortes em 4% e o dano crítico desses ataques em 25% por ranque.'),
    ('rend', 'sword_s2', 'Habilidade ativa: golpe carregado que causa dano extra proporcional ao Vigor consumido, ignora a defesa do inimigo e tem chance de crítico aumentada.'),
    ('sunder-armor', 'sword_s6', 'Ataques fortes reduzem a resistência a dano do inimigo em 10% por ranque.'),
    # ---- Combate — Defesa
    ('arrow-deflection', 'sword_s10', 'Permite aparar flechas e virotes. No ranque 2, projéteis aparados no momento exato são refletidos de volta causando o dobro de dano.'),
    ('fleet-footed', 'sword_s9', 'Elimina completamente o dano recebido de golpes durante a esquiva.'),
    ('counterattack', 'sword_s11', 'Após um contra-ataque bem-sucedido, o próximo ataque causa +30% de dano por ranque, com efeitos adicionais nos ranques maiores.'),
    ('deadly-precision', 'sword_s3', 'Cada Ponto de Adrenalina adiciona 1% de chance por ranque de matar o inimigo instantaneamente.'),
    # ---- Combate — Tiro (Besta)
    ('lightning-reflexes', 'sword_s13', 'O tempo passa 50% mais devagar enquanto você mira com a besta.'),
    ('cold-blood', 'sword_s15', 'Cada virote que acerta o alvo gera Pontos de Adrenalina.'),
    ('anatomical-knowledge', 'sword_s7', 'Aumenta a chance de acerto crítico com a besta em 20% por ranque.'),
    ('crippling-shot', 'sword_s12', 'Acertos críticos com a besta desativam as habilidades especiais de monstros por 10 segundos por ranque.'),
    # ---- Combate — Transe de Batalha
    ('resolve', 'sword_s16', 'Reduz em 33% por ranque a perda de Pontos de Adrenalina ao sofrer dano.'),
    ('undying', 'sword_s18', 'Quando a Vitalidade chega a 0, Pontos de Adrenalina são consumidos para restaurá-la (com bônus maior por ranque). Requer ao menos 1 Ponto de Adrenalina.'),
    ('razor-focus', 'sword_s20', 'Ganha instantaneamente 1 Ponto de Adrenalina ao entrar em combate, e golpes de espada geram 10% mais Adrenalina por ranque.'),
    ('flood-of-anger', 'sword_s19', 'Ao conjurar um Sinal, consome 3 Pontos de Adrenalina (se disponíveis) para lançá-lo no nível aprimorado e com intensidade bônus.'),

    # ---- Signos — Aard
    ('far-reaching-aard', 'magic_s20', 'Aumenta o alcance de Aard em 1 jarda por ranque.'),
    ('aard-sweep', 'magic_s1', 'Modo alternativo de Sinal: Aard atinge todos os inimigos em um raio ao redor de Geralt, com chance de derrubada.'),
    ('aard-intensity', 'magic_s12', 'Aumenta a intensidade do Sinal Aard em 10% por ranque.'),
    ('shock-wave', 'magic_s6', 'Aard passa a causar 100 de dano por ranque (o dano escala com o nível do inimigo).'),
    # ---- Signos — Igni
    ('igni-melt-armor', 'magic_s8', 'O dano de Igni também enfraquece permanentemente a armadura do inimigo. O efeito escala com a intensidade de Sinais.'),
    ('firestream', 'magic_s2', 'Modo alternativo de Sinal: emite um jato contínuo de fogo que causa dano enquanto houver Vigor.'),
    ('igni-intensity', 'magic_s7', 'Aumenta a intensidade do Sinal Igni em 10% por ranque.'),
    ('pyromaniac', 'magic_s9', 'Aumenta a chance de aplicar Queimando em 33% por ranque.'),
    # ---- Signos — Yrden
    ('sustained-glyphs', 'magic_s10', 'Aumenta a duração do Sinal Yrden e adiciona cargas ao modo alternativo (armadilha).'),
    ('yrden-magic-trap', 'magic_s3', 'Modo alternativo de Sinal: armadilha mágica que causa dano e retarda inimigos em um raio, além de destruir projéteis que a atravessam.'),
    ('yrden-intensity', 'magic_s16', 'Aumenta a intensidade do Sinal Yrden em 10% por ranque.'),
    ('supercharged-glyphs', 'magic_s11', 'Inimigos sob o efeito de Yrden perdem Vitalidade ou Essência por segundo.'),
    # ---- Signos — Quen
    ('exploding-shield', 'magic_s13', 'O escudo de Quen empurra os inimigos próximos e causa dano quando se rompe.'),
    ('active-shield', 'magic_s4', 'Modo alternativo de Sinal: escudo ativo mantido que restaura Vitalidade ao bloquear golpes. Mantê-lo drena Vigor.'),
    ('quen-intensity', 'magic_s15', 'Aumenta a intensidade do Sinal Quen em 10% por ranque.'),
    ('quen-discharge', 'magic_s14', 'Reflete 10% por ranque do dano absorvido pelo escudo de volta ao atacante.'),
    # ---- Signos — Axii
    ('delusion', 'magic_s17', 'Axii abre opções de diálogo alternativas. O alvo não avança contra Geralt durante a conjuração, e a eficácia aumenta por ranque.'),
    ('axii-puppet', 'magic_s5', 'Modo alternativo de Sinal: o inimigo alvo vira aliado temporário e causa 20% mais dano por ranque.'),
    ('axii-intensity', 'magic_s18', 'Aumenta a intensidade do Sinal Axii em 10% por ranque.'),
    ('domination', 'magic_s19', 'Axii pode influenciar dois inimigos ao mesmo tempo, com efeito 50% mais fraco.'),

    # ---- Alquimia — Poções
    ('heightened-tolerance', 'alchemy_s1', 'Aumenta o limiar de overdose de poções em 10% por ranque, permitindo usar mais toxicidade com segurança.'),
    ('refreshment', 'alchemy_s2', 'Cada dose de poção bebida cura 10% por ranque da Vitalidade máxima.'),
    ('delayed-recovery', 'alchemy_s3', 'Efeitos de poções não terminam até a Toxicidade cair abaixo de um limiar — no ranque 3, só quando chegar a 0.'),
    ('side-effects', 'alchemy_s4', 'Beber uma poção tem 33% de chance por ranque de ativar de graça o efeito de outra poção conhecida aleatória.'),
    # ---- Alquimia — Óleos
    ('poisoned-blade', 'alchemy_s12', 'O óleo aplicado na lâmina dá chance a cada acerto de envenenar o alvo. A chance escala com o nível do óleo.'),
    ('protective-coating', 'alchemy_s5', 'Adiciona 5% por ranque de proteção contra ataques do tipo de monstro alvo do óleo aplicado na espada.'),
    ('fixative', 'alchemy_s6', 'Óleos aplicados na lâmina têm 33% mais cargas por ranque.'),
    ('hunter-instinct', 'alchemy_s7', 'Com Adrenalina no máximo, aumenta o dano crítico contra o tipo de inimigo alvo do óleo em 33% por ranque.'),
    # ---- Alquimia — Bombas
    ('steady-aim', 'alchemy_s9', 'O tempo passa 50% mais devagar enquanto você mira bombas.'),
    ('pyrotechnics', 'alchemy_s10', 'Bombas que normalmente não causam dano passam a causar dano físico extra.'),
    ('efficiency', 'alchemy_s8', 'Aumenta em 1 por ranque o número máximo de bombas em cada slot.'),
    ('cluster-bombs', 'alchemy_s11', 'Ao detonar, bombas se dividem em fragmentos explosivos.'),
    # ---- Alquimia — Mutação
    ('acquired-tolerance', 'alchemy_s18', 'Cada fórmula de alquimia conhecida de nível 1 (ranques seguintes incluem níveis 2 e 3) aumenta a Toxicidade máxima em 0,5.'),
    ('tissue-transmutation', 'alchemy_s13', 'Decocções de mutagênio aumentam a Vitalidade máxima em 300 por ranque enquanto durarem.'),
    ('synergy', 'alchemy_s19', 'Aumenta em 17% por ranque o bônus do mutagênio colocado em slot de mutagênio.'),
    ('adaptation', 'alchemy_s14', 'Estende a duração efetiva de todas as decocções de mutagênio em 33% por ranque.'),
    # ---- Alquimia — Provação das Gramíneas
    ('frenzy', 'alchemy_s16', 'Com Toxicidade acima de 0, o tempo desacelera automaticamente quando um inimigo está prestes a contra-atacar.'),
    ('endure-pain', 'alchemy_s20', 'Aumenta a Vitalidade máxima quando a Toxicidade ultrapassa o limiar seguro.'),
    ('fast-metabolism', 'alchemy_s15', 'A Toxicidade cai 1 ponto por segundo mais rápido por ranque.'),
    ('killing-spree', 'alchemy_s17', 'Com Toxicidade acima de 0, cada inimigo morto aumenta a chance de acerto crítico em 10% por ranque durante o combate.'),

    # ---- Geral (base)
    ('sun-and-stars', 'perk_1', 'Durante o dia, regenera Vitalidade extra fora de combate; durante a noite, regenera Vigor extra mesmo em combate.'),
    ('steady-shot', 'perk_2', 'Virotes de besta causam 25% mais dano.'),
    ('survival-instinct', 'perk_4', 'Aumenta a Vitalidade máxima em 15%.'),
    ('cat-school-techniques', 'perk_5', 'Cada peça de armadura leve equipada aumenta o dano crítico em 25% e o dano de ataques rápidos em 5%.'),
    ('griffin-school-techniques', 'perk_6', 'Cada peça de armadura média equipada aumenta a intensidade de Sinais em 5% e a regeneração de Vigor em 5%.'),
    ('ursine-school-techniques', 'perk_7', 'Cada peça de armadura pesada equipada aumenta a Vitalidade máxima em 5% e o dano de ataques fortes em 5%.'),
    ('rage-management', 'perk_9', 'Quando o Vigor for insuficiente, Sinais podem ser conjurados consumindo Pontos de Adrenalina.'),
    ('adrenaline-burst', 'perk_10', 'Aumenta a geração de Adrenalina em 5%, e conjurar Sinais passa a gerar Pontos de Adrenalina.'),
    ('focus', 'perk_11', 'Pontos de Adrenalina aumentam tanto o dano das armas quanto a intensidade dos Sinais.'),
    ('metabolic-control', 'perk_12', 'Aumenta a Toxicidade máxima em 30 pontos.'),
    # ---- Geral (Hearts of Stone)
    ('metabolism-boosts', 'perk_13', 'Se houver Pontos de Adrenalina disponíveis, eles são consumidos para reduzir o custo de Toxicidade ao beber poções.'),
    ('trick-shot', 'perk_17', 'Permite disparar um virote adicional antes de precisar recarregar a besta.'),
    ('advanced-pyrotechnics', 'perk_18', 'O dano causado por explosões de bombas gera Pontos de Adrenalina.'),
    ('battle-frenzy', 'perk_19', 'Substitui o efeito do Transe de Batalha: cada Ponto de Adrenalina aumenta a chance de acerto crítico.'),
    ('strong-back', 'perk_22', 'Aumenta o peso máximo do inventário em 60.'),
    # ---- Geral (Blood and Wine)
    ('gorged-on-power', 'perk_14', 'O bônus de um Local de Poder dura indefinidamente, mas só um bônus desse tipo pode estar ativo por vez.'),
    ('gourmet', 'perk_15', 'Comer comida regenera Vitalidade por 20 minutos.'),
    ('in-combats-fires', 'perk_16', 'Você ignora os efeitos das próprias bombas e virotes especiais.'),
    ('heavy-artillery', 'perk_20', 'O dano das bombas triplica, mas o número de bombas em cada slot cai pela metade.'),
    ('attack-is-the-best-defense', 'perk_21', 'Cada ação defensiva gera Pontos de Adrenalina: aparar, contra-atacar, esquivar e rolar.'),
]

assert len(TABLE) == 80, len(TABLE)
assert len({t[0] for t in TABLE}) == 80
assert {t[1] for t in TABLE} == set(by_gid), set(by_gid) ^ {t[1] for t in TABLE}

out = []
for app_id, gid, desc in TABLE:
    g = by_gid[gid]
    entry = {
        'id': app_id,
        'gameId': gid,
        'name': g['nameBr'],
        'category': g['category'],
        'color': CAT_COLOR[g['category']],
        'tier': g['tier'],
        'maxRank': g['maxRank'],
        'description': desc,
    }
    if g.get('requiresDLC'):
        entry['requiresDLC'] = g['requiresDLC']
    out.append(entry)

path = f'{REPO}/src/lib/data/skills.json'
lines = ['[']
prev = None
for i, s in enumerate(out):
    if prev is not None and s['category'] != prev:
        lines.append('')
    prev = s['category']
    line = '  ' + json.dumps(s, ensure_ascii=False) + (',' if i < len(out) - 1 else '')
    lines.append(line)
lines.append(']')
open(path, 'w').write('\n'.join(lines) + '\n')
print('wrote', len(out), 'skills')
