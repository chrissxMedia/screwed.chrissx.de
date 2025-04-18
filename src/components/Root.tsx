import Table, { type LengthUnit, type PartialSettings, type PitchUnit } from "./Table";
import { M, mCoarse, mFine, Thread, unc, unef, unf, UTS } from "../Thread";
import { deflate, inflate } from "pako";
import { useState } from "preact/hooks";
import { Buffer } from "buffer";

function encodeHash(settings: PartialSettings): string {
    const j = { ...settings, threads: settings.threads?.map(x => x.name).join(";") };
    return "#" + Buffer.from(deflate(JSON.stringify(j), { raw: true, level: 9 })!).toString("base64");
}

function decodeHash(s: string): PartialSettings {
    const j = JSON.parse(inflate(Buffer.from(s.substring(1), "base64"), { to: "string", raw: true }) as string);
    return { ...j, threads: j.threads.split(";").map(Thread) };
}

export default function Root() {
    const [lengthUnit, setLengthUnit] = useState<LengthUnit>("mm");
    const [pitchUnit, setPitchUnit] = useState<PitchUnit>("tpi");
    const [threads, setThreads] = useState<Thread[]>([
        // this has gotten way out of hand and we need to show a lot less by default
        // TODO: just have a few things here
        ...Object.keys(mCoarse).map(Number).sort((a, b) => a - b).map(x => M(x, "coarse")),
        ...Object.keys(mFine).map(Number).sort((a, b) => a - b).map(x => M(x, "fine")),
        UTS("#000", 120), UTS("#00", 90), UTS("#0", "fine"),
        UTS("#1"), UTS("#2"), UTS("#3"), UTS("#4"), UTS("#5"), UTS("#6"),
        ...Object.keys(unc).map(Number).filter(x => x >= .25).sort((a, b) => a - b).map(x => UTS(x.toString())),
        ...Object.keys(unf).map(Number).filter(x => x >= .25).sort((a, b) => a - b).map(x => UTS(x.toString(), "fine")),
        ...Object.keys(unef).map(Number).filter(x => x >= .25).sort((a, b) => a - b).map(x => UTS(x.toString(), "extrafine")),
    ].filter(t => t) as Thread[]);
    const [newThread, setNewThread] = useState<string>("");
    const addThread = () => {
        const t = Thread(newThread);
        if (t == undefined) {
            alert("Cannot parse thread: \"" + newThread + "\"");
            return;
        }
        setThreads([...threads, t]);
        setNewThread("");
    };
    //useEffect(() => {
    //    const { lengthUnit, pitchUnit, threads } = decodeHash(window.location.hash);
    //    if (lengthUnit) setLengthUnit(lengthUnit);
    //    if (pitchUnit) setPitchUnit(pitchUnit);
    //    if (threads) setThreads(threads);
    //}, [window.location.hash]);
    //threads.forEach(t => {
    //    let T = Thread(t.name);
    //    console.assert(!(T instanceof String), T);
    //    T = T as Thread;
    //    console.assert(t.name == T.name, T.name + " ≠ " + t.name);
    //    console.assert(t.diameter.toString() == T.diameter.toString(), T.diameter.toString() + " ≠ " + t.diameter.toString() + " – " + t.name);
    //    console.assert(t.pitch.toString() == T.pitch.toString(), T.pitch.toString() + " ≠ " + t.pitch.toString() + " – " + t.name);
    //});
    const hash = encodeHash({ lengthUnit, pitchUnit, threads });
    if (hash != window.location.hash) window.location.hash = hash;
    console.log(decodeHash(window.location.hash));
    console.log(encodeHash({ lengthUnit, pitchUnit, threads }).length);
    return (
        <>
            <div className="buttonhost">
                <label htmlFor="lengthunits">Length/Diameter/… Unit:&nbsp;</label>
                <select size={2} id="lengthunits" onChange={x => setLengthUnit(x.target.value as LengthUnit)} value={lengthUnit}>
                    <option value="mm">Millimeter</option>
                    <option value="in">Inch</option>
                </select>
                <div className="interbuttonspacer" />
                <label htmlFor="pitchunits">Pitch Unit:&nbsp;</label>
                <select size={2} id="pitchunits" onChange={x => setPitchUnit(x.target.value as PitchUnit)} value={pitchUnit}>
                    <option value="tpmm">Threads per Millimeter</option>
                    <option value="tpi">Threads per Inch</option>
                </select>
                <div className="interbuttonspacer" />
                <label htmlFor="newthread">Add Thread:&nbsp;</label>
                <input type="text" value={newThread} id="newthread" onChange={e => setNewThread(e.target.value)} onKeyDown={e => e.key == "Enter" && addThread()} />
                <input type="button" value="+ Add" onClick={_ => addThread()} />
                <div className="interbuttonspacer" />
                <input type="button" value="Clear All Threads" onClick={_ => setThreads([])} />
            </div>
            <br />
            <Table {...{ lengthUnit, pitchUnit, threads }} />
        </>
    );
}
