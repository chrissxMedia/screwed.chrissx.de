import React from "react";
import { minorDiameter, Thread } from "./thread";

export default function Table({ unit, threads }: { unit: "mm" | "inch", threads: Thread[] }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Dmaj</th>
                    <th>Dmin</th>
                </tr>
            </thead>
            <tbody>
                {threads.map(x =>
                    <tr>
                        <td>{x.diameter.toNumber(unit)}</td>
                        <td>{minorDiameter(x).toNumber(unit)}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
