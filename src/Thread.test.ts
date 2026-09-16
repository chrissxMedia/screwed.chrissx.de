import { expect, test } from "@jest/globals";
import { M, mCoarse, mFine, minorDiameter, pitchDiameter, Thread, unc, unef, unf, UTS } from "./Thread";

test.each([
    [" M1", "M1", 1, .25],
    ["M1x.25", "M1", 1, .25],
    ["m2 ", "M2", 2, .4],
    ["mf3", "MF3", 3, .35],
    ["m4 × 1", "M4×1", 4, 1],
])("parses metric %s", (input, name, diameterMm, pitchMm) => {
    expect(Thread(input)).toEqual({ name, diameterMm, pitchMm });
});

test.each([
    ['uNc #6 - 32', 'UNC #6-32', .138, 32],
    [' Unf#6', 'UNF #6-40', .138, 40],
    ['# 000-64', '#000-64', .034, 64],
    ['#00-90', '#00-90', .047, 90],
    ['#0000-120', '#0000-120', .021, 120],
    ['#7-32', '#7-32', .151, 32],
    ['#99-32', '#99-32', 1.347, 32],
    ['0.151-32', '#7-32', .151, 32],
    ['1"-8', 'UNC 1"-8', 1, 8],
    ['1/2"-13', 'UNC 1/2"-13', .5, 13],
    ['UNC 0.25-20', 'UNC 1/4"-20', .25, 20],
    ['1/4″ – 20 unc', 'UNC 1/4"-20', .25, 20],
    ['1/4 UNF', 'UNF 1/4"-28', .25, 28],
    ['UNEF 1/4', 'UNEF 1/4"-32', .25, 32],
    ['1 1 / 4"-7', 'UNC 1 1/4"-7', 1.25, 7],
    ['5/4-7', 'UNC 1 1/4"-7', 1.25, 7],
    ['1/8-40', 'UNC #5-40', .125, 40],
    ['13/64-20', '13/64"-20', 13 / 64, 20],
])("parses UTS %s", (input, name, diameter, tpi) => {
    expect(Thread(input)).toEqual({ name, diameterMm: diameter * 25.4, pitchMm: 25.4 / tpi });
});

test.each([
    '', 'M', 'M6junk', 'M6x', 'M6x1x2', 'MF6x1',
    '1/4', '#6', 'UNC 13/64', 'UNC 13/64-20', 'UNC 1/4-28', '1/4-20 UNF',
    'UNC 1/4-20 UNF', '1/4-20junk', '1/4+1/8-20', '1-1/4-20',
    '1in-8', '1,25-7', '1e2-20', '1/4-20-2A',
])("rejects unsupported syntax or series %s", input => {
    expect(Thread(input)).toBeUndefined();
});

test("all table entries and custom names round-trip", () => {
    const threads = [
        ...Object.keys(mCoarse).map(d => M(Number(d))),
        ...Object.keys(mFine).map(d => M(Number(d), "fine")),
        ...Object.keys(unc).map(d => UTS(d)),
        ...Object.keys(unf).map(d => UTS(d, "fine")),
        ...Object.keys(unef).map(d => UTS(d, "extrafine")),
        ...['#0000', '#000', '#00', '#7', '13/64'].map(d => UTS(d, 120)),
    ];
    for (const t of threads) {
        expect(t).toBeDefined();
        expect(Thread(t!.name)).toEqual(t);
    }
});

test("diameter calculations use millimetres for both thread systems", () => {
    for (const t of [M(6)!, UTS('1', 25.4)!]) {
        expect(t.pitchMm).toBe(1);
        expect(minorDiameter(t)).toBeCloseTo(t.diameterMm - 1.08253175473, 10);
        expect(pitchDiameter(t)).toBeCloseTo(t.diameterMm - .6495190528, 10);
    }
    expect(UTS('bad', 20)).toBeUndefined();
});
