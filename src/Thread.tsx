import { multiply, subtract, unit, Unit } from "mathjs";

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

const mCoarse = {
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

const mFine = {
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
        name: "M" + diameter + (p == mCoarse[diameter] ? "" : "×" + p),
        diameter: unit(diameter, "mm"),
        pitch: unit(p, "mm")
    };
}
