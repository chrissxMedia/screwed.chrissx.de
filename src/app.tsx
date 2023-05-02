import Drawing from "./Drawing";
import React from "react";
import ReactDOMClient from "react-dom/client";
import Table, { LengthUnit, PartialSettings, PitchUnit } from "./Table";
import { M, mCoarse, mFine, Thread, UTS } from "./Thread";
import { deflate, inflate } from "pako";

function encodeHash(settings: PartialSettings): string {
    const j = { ...settings, threads: settings.threads?.map(x => x.name).join(";") };
    return "#" + Buffer.from(deflate(JSON.stringify(j), { raw: true, level: 9 })!).toString("base64");
}

function decodeHash(s: string): PartialSettings {
    const j = JSON.parse(inflate(Buffer.from(s.substring(1), "base64"), { to: "string", raw: true }) as string);
    return { ...j, threads: j.threads.split(";").map(Thread) };
}

function Root() {
    // this is the ugliest hack ever
    console.log(M(4));
    const [lengthUnit, setLengthUnit] = React.useState<LengthUnit>("mm");
    const [pitchUnit, setPitchUnit] = React.useState<PitchUnit>("tpi");
    const [threads, setThreads] = React.useState<Thread[]>([
        ...Object.keys(mCoarse).map(Number).sort((a, b) => a - b).map(x => M(x, "coarse")),
        ...Object.keys(mFine).map(Number).sort((a, b) => a - b).map(x => M(x, "fine")),
        UTS("#000", 120), UTS("#00", 90), UTS("#0", "fine"),
        UTS("#1"), UTS("#2"), UTS("#3"), UTS("#4"), UTS("#5"), UTS("#6"),
    ]);
    const [newThread, setNewThread] = React.useState<string>("");
    const addThread = () => {
        const t = Thread(newThread);
        if (t == undefined) {
            alert("Cannot parse thread: \"" + newThread + "\"");
            return;
        }
        setThreads([...threads, t]);
        setNewThread("");
    };
    //React.useEffect(() => {
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
    window.location.hash = encodeHash({ threads });
    console.log(decodeHash(window.location.hash));
    console.log(encodeHash({ threads }).length);
    return (
        <>
            <Drawing />
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
                {
                    // this isn't perfect accessibility wise
                    // TODO: fix that
                }
                <input type="text" value={newThread} onChange={e => setNewThread(e.target.value)} onKeyDown={e => e.key == "Enter" ? addThread() : undefined} />
                <input type="button" value={"Add Thread"} onClick={_ => addThread()} />
                <input type="button" value={"Clear"} onClick={_ => setThreads([])} />
            </div>
            <br />
            <Table {...{ lengthUnit, pitchUnit, threads }} />
        </>
    );
}

ReactDOMClient.createRoot(document.getElementById("root")!).render(<Root />);
