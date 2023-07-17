import { unit } from "mathjs";
import { Thread } from "./Thread";

[
    [" M1", "M1", unit("1mm"), unit(".25mm")],
    ["m2 ", "M2", unit("2mm"), unit(".4mm")],
    ["mf3", "MF3", unit("3mm"), unit(".35mm")],
    ["m4x1", "M4×1", unit("4mm"), unit("1mm")],
    ["uNc #6 - 32", "UNC #6-32", unit(".138in"), unit(".03125in")],
    [" Unf#6", "UNF #6-40", unit(".138in"), unit(".025in")],
    ["# 000-64", "#000-64", unit(".06in"), unit(".015625in")],
    // TODO: inch screws and prefixes
].forEach(t => test("\"" + t[0] + "\" gets parsed as \"" + t[1] +
    "\" with a major diameter of " + t[2] + " and a pitch of " + t[3],
    () => expect(Thread(t[0] as string)).toStrictEqual({ name: t[1], diameter: t[2], pitch: t[3] })));
