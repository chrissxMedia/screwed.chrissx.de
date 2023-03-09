import { divide, round, Unit } from "mathjs";
import React from "react";
import { minorDiameter, pitchDiameter, Thread } from "./thread";

export type LengthUnit = "mm" | "inch";
export type PitchUnit = "tpmm" | "tpi";

function convert(u: Unit, to: LengthUnit | PitchUnit): number {
    if(to == "tpmm") return 1 / u.toNumber("mm");
    if(to == "tpi") return 1 / u.toNumber("inch");
    return u.toNumber(to);
}

export default function Table({ lengthUnit, pitchUnit, threads }: { lengthUnit: LengthUnit, pitchUnit: PitchUnit, threads: Thread[] }) {
    const rnd = (x: Unit, unit: LengthUnit | PitchUnit = lengthUnit) => round(convert(x, unit), 4);
    return (
        <table>
            <thead>
                <tr>
                    <th>Thread</th>
                    <th>D<sub>maj</sub> / {lengthUnit}</th>
                    <th>D<sub>p</sub> / {lengthUnit}</th>
                    <th>D<sub>min</sub> / {lengthUnit}</th>
                    <th>P / {pitchUnit}</th>
                    <th>P / {lengthUnit}</th>
                    <th><sup>P</sup>&frasl;<sub>2</sub> / {lengthUnit}</th>
                    <th><sup>P</sup>&frasl;<sub>4</sub> / {lengthUnit}</th>
                    <th><sup>P</sup>&frasl;<sub>8</sub> / {lengthUnit}</th>
                </tr>
            </thead>
            <tbody>
                {threads.map(x =>
                    <tr key={x.name}>
                        <td>{x.name}</td>
                        <td>{rnd(x.diameter)}</td>
                        <td>{rnd(pitchDiameter(x))}</td>
                        <td>{rnd(minorDiameter(x))}</td>
                        <td>{rnd(x.pitch, pitchUnit)}</td>
                        <td>{rnd(x.pitch)}</td>
                        <td>{rnd(divide(x.pitch, 2))}</td>
                        <td>{rnd(divide(x.pitch, 4))}</td>
                        <td>{rnd(divide(x.pitch, 8))}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
