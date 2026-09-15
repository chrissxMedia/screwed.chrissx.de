import { minorDiameter, pitchDiameter, Thread } from "../Thread";

export type LengthUnit = "mm" | "in";
export type PitchUnit = "tpmm" | "tpi";

export type Settings = {
    lengthUnit: LengthUnit,
    pitchUnit: PitchUnit,
    threads: Thread[],
};

export default function Table({ lengthUnit, pitchUnit, threads }: Settings) {
    const rdl = (mm: number) => Number((mm / (lengthUnit === "in" ? 25.4 : 1)).toFixed(4));
    const rdp = (mm: number) => Number(((pitchUnit === "tpi" ? 25.4 : 1) / mm).toFixed(4));
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
                        <td>{rdl(x.diameterMm)}</td>
                        <td className="unimportant">{rdl(pitchDiameter(x))}</td>
                        <td className="unimportant">{rdl(minorDiameter(x))}</td>
                        <td>{rdp(x.pitchMm)}</td>
                        <td>{rdl(x.pitchMm)}</td>
                        <td className="unimportant">{rdl(x.pitchMm / 2)}</td>
                        <td className="unimportant">{rdl(x.pitchMm / 4)}</td>
                        <td className="unimportant">{rdl(x.pitchMm / 8)}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
