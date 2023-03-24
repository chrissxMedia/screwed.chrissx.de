import { evaluate, multiply, round, subtract, unit, Unit } from "mathjs";

export type Thread = {
    name: string,
    diameter: Unit,
    pitch: Unit,
};

export function minorDiameter(t: Thread): Unit {
    return subtract(t.diameter, multiply(1.08253175473, t.pitch)) as Unit;
}

export function pitchDiameter(t: Thread): Unit {
    return subtract(t.diameter, multiply(0.6495190528, t.pitch)) as Unit;
}

export const mCoarse = {
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

export const mFine = {
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

export function M(diameter: number, pitch: number | "coarse" | "fine" = "coarse"): Thread {
    const p = pitch == "coarse" ? mCoarse[diameter] : "fine" ? mFine[diameter] : pitch;
    return {
        name: pitch == "coarse" ? "M" + diameter : pitch == "fine" ? "MF" + diameter : "M" + diameter + "×" + p,
        diameter: unit(diameter, "mm"),
        pitch: unit(p, "mm"),
    };
}

export const unc = {
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

export const unf = {
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

export const unef = {
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

export function UTS(diameter: string, tpi: number | "unc" | "coarse" | "unf" | "fine" | "unef" | "extrafine" = "unc"): Thread {
    const ed = diameter.includes("#00") ? "#-" + (diameter.split("0").length - 2) : diameter;
    const d = round(evaluate(ed.replace("#", "0.060+0.013*")), 10);
    const t = tpi == "unc" || tpi == "coarse" ? unc[d] : tpi == "unf" || tpi == "fine" ? unf[d] : tpi == "unef" || tpi == "extrafine" ? unef[d] : tpi;
    console.log("UTS diameter: " + d);
    return {
        name: diameter + "-" + t,
        diameter: unit(d, "in"),
        pitch: unit(1 / t, "in"),
    };
}
