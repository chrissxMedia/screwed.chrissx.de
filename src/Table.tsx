import { divide, round } from "mathjs";
import React from "react";
import { minorDiameter, pitchDiameter, Thread } from "./thread";

export default function Table({ unit, threads }: { unit: "mm" | "inch", threads: Thread[] }) {
    const rnd = (x: number) => round(x, unit == "inch" ? 4 : 3);
    return (
        <table>
            <thead>
                <tr>
                    <th>Thread</th>
                    <th>D<sub>maj</sub></th>
                    <th>D<sub>p</sub></th>
                    <th>D<sub>min</sub></th>
                    <th>P</th>
                    <th>P/2</th>
                    <th>P/4</th>
                    <th>P/8</th>
                </tr>
            </thead>
            <tbody>
                {threads.map(x =>
                    <tr key={x.name}>
                        <td>{x.name}</td>
                        <td>{rnd(x.diameter.toNumber(unit))}</td>
                        <td>{rnd(pitchDiameter(x).toNumber(unit))}</td>
                        <td>{rnd(minorDiameter(x).toNumber(unit))}</td>
                        <td>{rnd(x.pitch.toNumber(unit))}</td>
                        <td>{rnd(divide(x.pitch, 2).toNumber(unit))}</td>
                        <td>{rnd(divide(x.pitch, 4).toNumber(unit))}</td>
                        <td>{rnd(divide(x.pitch, 8).toNumber(unit))}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
