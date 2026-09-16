export type Thread = {
    name: string,
    diameterMm: number,
    pitchMm: number,
};

export function minorDiameter(t: Thread): number {
    return t.diameterMm - 1.08253175473 * t.pitchMm;
}

export function pitchDiameter(t: Thread): number {
    return t.diameterMm - 0.6495190528 * t.pitchMm;
}

export const mCoarse: Record<number, number | undefined> = {
    1: 0.25,
    1.2: 0.25,
    1.4: 0.3,
    1.6: 0.35,
    1.8: 0.35,
    2: 0.4,
    2.5: 0.45,
    3: 0.5,
    3.5: 0.6,
    4: 0.7,
    5: 0.8,
    6: 1,
    7: 1,
    8: 1.25,
    10: 1.5,
    12: 1.75,
    14: 2,
    16: 2,
    18: 2.5,
    20: 2.5,
    22: 2.5,
    24: 3,
    27: 3,
    30: 3.5,
    33: 3.5,
    36: 4,
    39: 4,
    42: 4.5,
    45: 4.5,
    48: 5,
    52: 5,
    56: 5.5,
    60: 5.5,
    64: 6,
};

export const mFine: Record<number, number | undefined> = {
    1: 0.2,
    1.2: 0.2,
    1.4: 0.2,
    1.6: 0.2,
    1.8: 0.2,
    2: 0.25,
    2.5: 0.35,
    3: 0.35,
    3.5: 0.35,
    4: 0.5,
    5: 0.5,
    6: 0.75,
    7: 0.75,
    14: 1.5,
    16: 1.5,
    24: 2,
    27: 2,
    30: 2,
    33: 2,
    36: 3,
    39: 3,
    42: 3,
    45: 3,
    48: 3,
    52: 4,
    56: 4,
    60: 4,
    64: 4,
};

export function M(diameter: number, pitch: number | "coarse" | "fine" = "coarse"): Thread | undefined {
    const p = pitch == "coarse" ? mCoarse[diameter] : pitch == "fine" ? mFine[diameter] : pitch;
    if (p === undefined) return;
    return {
        name: mCoarse[diameter] === p ? "M" + diameter :
            mFine[diameter] === p ? "MF" + diameter :
                "M" + diameter + "×" + p,
        diameterMm: diameter,
        pitchMm: p,
    };
}

export const unc: Record<number, number | undefined> = {
    0.0730: 64,
    0.0860: 56,
    0.0990: 48,
    0.1120: 40,
    0.1250: 40,
    0.1380: 32,
    0.1640: 32,
    0.1900: 24,
    0.2160: 24,
    0.2500: 20,
    0.3125: 18,
    0.3750: 16,
    0.4375: 14,
    0.5000: 13,
    0.5625: 12,
    0.6250: 11,
    0.7500: 10,
    0.8750: 9,
    1.0000: 8,
    1.1250: 7,
    1.2500: 7,
    1.3750: 6,
    1.5000: 6,
    1.7500: 5,
    2.0000: 4.5,
    2.2500: 4.5,
    2.5000: 4,
    2.7500: 4,
    3.0000: 4,
    3.2500: 4,
    3.5000: 4,
    3.7500: 4,
    4.0000: 4,
};

export const unf: Record<number, number | undefined> = {
    0.0600: 80,
    0.0730: 72,
    0.0860: 64,
    0.0990: 56,
    0.1120: 48,
    0.1250: 44,
    0.1380: 40,
    0.1640: 36,
    0.1900: 32,
    0.2160: 28,
    0.2500: 28,
    0.3125: 24,
    0.3750: 24,
    0.4375: 20,
    0.5000: 20,
    0.5625: 18,
    0.6250: 18,
    0.7500: 16,
    0.8750: 14,
    1.0000: 12,
    1.1250: 12,
    1.2500: 12,
    1.3750: 12,
    1.5000: 12,
};

export const unef: Record<number, number | undefined> = {
    0.2160: 32,
    0.2500: 32,
    0.3125: 32,
    0.3750: 32,
    0.4375: 28,
    0.5000: 28,
    0.5625: 24,
    0.6250: 24,
    0.7500: 20,
    0.8750: 20,
    1.0000: 20,
};

const decimal = String.raw`[+-]?(?:\d+(?:\.\d*)?|\.\d+)`;
const metricPattern = new RegExp(`^M(F)?\\s*(${decimal})(?:\\s*X\\s*(${decimal}))?$`);
const inchPattern = new RegExp(`^(${decimal})\\s*["″]?$`);
const utsPattern = new RegExp(`^(UNC|UNF|UNEF)?\\s*(.+?)(?:\\s*-\\s*(${decimal}))?\\s*(UNC|UNF|UNEF)?$`);
const series = { UNC: "coarse", UNF: "fine", UNEF: "extrafine" } as const;

function inchDiameter(s: string): number | undefined {
    s = s.trim();
    const gauge = /^#\s*(\d+)$/.exec(s);
    if (gauge) {
        const n = /^0+$/.test(gauge[1]) ? 1 - gauge[1].length : Number(gauge[1]);
        return (60 + 13 * n) / 1000;
    }
    const fraction = /^([+-]?)(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)\s*["″]?$/.exec(s);
    if (fraction) return (fraction[1] === "-" ? -1 : 1) * (Number(fraction[2] ?? 0) + Number(fraction[3]) / Number(fraction[4]));
    const number = inchPattern.exec(s);
    if (number) return Number(number[1]);
}

function inchName(d: number): string {
    const gauge = Math.round((d * 1000 - 60) / 13);
    if (d < .25 && (60 + 13 * gauge) / 1000 === d)
        return gauge < 0 ? "#" + "0".repeat(1 - gauge) : "#" + gauge;
    if (Number.isInteger(d)) return d + '\"';
    for (let den = 2; den <= 64; den *= 2) {
        if (Number.isInteger(d * den)) {
            const whole = Math.abs(Math.trunc(d));
            const num = Math.abs(d * den % den);
            return (d < 0 ? "-" : "") + (whole ? whole + " " : "") + num + "/" + den + '\"';
        }
    }
    return d + '\"';
}

export function UTS(diameter: string, tpi: number | "coarse" | "fine" | "extrafine" = "coarse"): Thread | undefined {
    const d = inchDiameter(diameter);
    if (d === undefined) return;
    const t = tpi == "coarse" ? unc[d] : tpi == "fine" ? unf[d] : tpi == "extrafine" ? unef[d] : tpi;
    if (t === undefined) return;
    const prefix = unc[d] == t ? "UNC " : unf[d] == t ? "UNF " : unef[d] == t ? "UNEF " : "";
    return {
        name: prefix + inchName(d) + "-" + t,
        diameterMm: d * 25.4,
        pitchMm: 25.4 / t,
    };
}

export function Thread(s: string): Thread | undefined {
    s = s.trim().toUpperCase().replaceAll("×", "X").replaceAll("–", "-");
    const metric = metricPattern.exec(s);
    if (metric) {
        if (metric[1] && metric[3] !== undefined) return;
        return M(Number(metric[2]), metric[3] === undefined ? metric[1] ? "fine" : "coarse" : Number(metric[3]));
    }
    const uts = utsPattern.exec(s);
    if (!uts || uts[1] && uts[4]) return;
    const designation = series[(uts[1] || uts[4]) as keyof typeof series];
    if (uts[3] === undefined) return designation ? UTS(uts[2], designation) : undefined;
    const t = UTS(uts[2], Number(uts[3]));
    if (designation && (!t || UTS(uts[2], designation)?.pitchMm !== t.pitchMm)) return;
    return t;
}
