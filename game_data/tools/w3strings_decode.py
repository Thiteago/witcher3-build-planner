#!/usr/bin/env python3
"""Decode Witcher 3 .w3strings localization files (format per hhrhhr's Lua utils)."""
import struct, sys, zlib, json

KEYS = {
    0x83496237: (0x73946816, "pl"), 0x43975139: (0x79321793, "en"),
    0x75886138: (0x42791159, "de"), 0x45931894: (0x12375973, "it"),
    0x23863176: (0x75921975, "fr"), 0x24987354: (0x21793217, "cz"),
    0x18796651: (0x42387566, "es"), 0x18632176: (0x16875467, "zh"),
    0x77932179: (0x54932186, "ru"), 0x63481486: (0x42386347, "ru"),
    0x42378932: (0x67823218, "hu"), 0x54834893: (0x59825646, "jp"),
    0x56328893: (0x43268768, "br"), 0x56432683: (0x21795135, "tr"),
}

class R:
    def __init__(self, data): self.d = data; self.p = 0
    def u8(self): v = self.d[self.p]; self.p += 1; return v
    def u16(self): v = struct.unpack_from('<H', self.d, self.p)[0]; self.p += 2; return v
    def u32(self): v = struct.unpack_from('<I', self.d, self.p)[0]; self.p += 4; return v

def bit6(r):
    result, shift, i = 0, 0, 1
    while True:
        b = r.u8()
        if b == 128: return 0
        s, mask = 6, 255
        if b > 127: mask, s = 127, 7
        elif b > 63:
            if i == 1: mask = 63
        result |= (b & mask) << shift
        shift += s
        i += 1
        if b < 64 or (i == 3 and b < 128): break
    return result

def decode(path):
    data = open(path, 'rb').read()
    r = R(data)
    assert data[:4] == b'RTSW', "bad magic"
    assert struct.unpack_from('<I', data, 4)[0] in (162, 163), "bad version"
    r.p = 8
    key1 = r.u16()
    key2 = struct.unpack_from('<H', data, len(data) - 2)[0]
    magic32 = (key1 << 16) | key2
    if magic32 == 0:
        xor_key, lang = 0, "cleartext"
    else:
        xor_key, lang = KEYS[magic32]
    r.p = 10
    count1 = bit6(r)
    t1 = []
    for _ in range(count1):
        str_id = r.u32() ^ xor_key
        offset = r.u32(); strlen = r.u32()
        t1.append((str_id, offset, strlen))
    count2 = bit6(r)
    id2hash = {}
    for _ in range(count2):
        h = r.u32()
        str_id = r.u32() ^ xor_key
        id2hash[str_id] = h
    count3 = bit6(r)
    str_start = r.p
    out = {}
    for str_id, offset, strlen in t1:
        pos = str_start + offset * 2
        skey = (xor_key >> 8) & 0xffff
        chars = []
        for j in range(strlen):
            b1 = data[pos]; b2 = data[pos + 1]; pos += 2
            ck = ((strlen + 1) * skey) & 0xffff
            b1 ^= ck & 0xff
            b2 ^= (ck >> 8) & 0xff
            skey = ((skey << 1) | (skey >> 15)) & 0xffff
            chars.append(b1 | (b2 << 8))
        out[str_id] = (id2hash.get(str_id), ''.join(chr(c) for c in chars))
    return lang, out

if __name__ == '__main__':
    lang, out = decode(sys.argv[1])
    print(f"lang={lang} entries={len(out)}", file=sys.stderr)
    dump = {str(k): [f"0x{h:08x}" if h is not None else None, s] for k, (h, s) in out.items()}
    json.dump(dump, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
