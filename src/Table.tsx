import { divide, round, Unit } from "mathjs";
import React from "react";
import { minorDiameter, pitchDiameter, Thread } from "./Thread";

export type LengthUnit = "mm" | "in";
export type PitchUnit = "tpmm" | "tpi";

export type Settings = {
    lengthUnit: LengthUnit,
    pitchUnit: PitchUnit,
    threads: Thread[],
};

export type PartialSettings = {
    lengthUnit?: LengthUnit,
    pitchUnit?: PitchUnit,
    threads?: Thread[],
};

export default function Table({ lengthUnit, pitchUnit, threads }: Settings) {
    const rdl = (x: Unit) => round(x.toNumber(lengthUnit), 4);
    const rdp = (x: Unit) => round(1 / x.toNumber({ "tpmm": "mm", "tpi": "in" }[pitchUnit]), 4);
    return (
        <table>
            <thead>
                <tr>
                    {
                        // TODO: gray out buttons
                    }
                    <th>Thread</th>
                    <th>D<sub>maj</sub> / {lengthUnit}</th>
                    <th className="unimportant">D<sub>p</sub> / {lengthUnit}</th>
                    <th className="unimportant">D<sub>min</sub> / {lengthUnit}</th>
                    <th>P / {pitchUnit}</th>
                    <th>P / {lengthUnit}</th>
                    <th className="unimportant"><sup>P</sup>&frasl;<sub>2</sub> / {lengthUnit}</th>
                    <th className="unimportant"><sup>P</sup>&frasl;<sub>4</sub> / {lengthUnit}</th>
                    <th className="unimportant"><sup>P</sup>&frasl;<sub>8</sub> / {lengthUnit}</th>
                </tr>
            </thead>
            <tbody>
                {threads.map(x =>
                    <tr key={x.name}>
                        <td>{x.name}</td>
                        <td>{rdl(x.diameter)}</td>
                        <td className="unimportant">{rdl(pitchDiameter(x))}</td>
                        <td className="unimportant">{rdl(minorDiameter(x))}</td>
                        <td>{rdp(x.pitch)}</td>
                        <td>{rdl(x.pitch)}</td>
                        <td className="unimportant">{rdl(divide(x.pitch, 2))}</td>
                        <td className="unimportant">{rdl(divide(x.pitch, 4))}</td>
                        <td className="unimportant">{rdl(divide(x.pitch, 8))}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
