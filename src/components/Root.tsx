import Table, { type LengthUnit, type PitchUnit, type Settings } from "./Table";
import { M, mCoarse, mFine, Thread, unc, unef, unf, UTS } from "../Thread";
import { useEffect, useState } from "preact/hooks";

function encodeHash(settings: Settings): string {
    return "#" + new URLSearchParams({
        length: settings.lengthUnit,
        pitch: settings.pitchUnit,
        threads: settings.threads.map(x => x.name).join("*"),
    });
}

function decodeHash(s: string): Partial<Settings> {
    if (!s) return {};
    const params = new URLSearchParams(s.substring(1));
    const lengthUnit = params.get("length");
    const pitchUnit = params.get("pitch");
    const names = params.get("threads");
    const settings: Partial<Settings> = {};
    if (lengthUnit === "mm" || lengthUnit === "in") settings.lengthUnit = lengthUnit;
    if (pitchUnit === "tpmm" || pitchUnit === "tpi") settings.pitchUnit = pitchUnit;
    if (names !== null) {
        const threads = names ? names.split("*").map(Thread) : [];
        if (!threads.some(t => !t)) settings.threads = threads as Thread[];
    }
    return settings;
}

const defaults: Settings = {
    lengthUnit: "mm",
    pitchUnit: "tpi",
    threads: [
        // this has gotten way out of hand and we need to show a lot less by default
        // TODO: just have a few things here
        ...Object.keys(mCoarse).map(Number).sort((a, b) => a - b).map(x => M(x, "coarse")),
        ...Object.keys(mFine).map(Number).sort((a, b) => a - b).map(x => M(x, "fine")),
        UTS("#000", 120), UTS("#00", 90), UTS("#0", "fine"),
        UTS("#1"), UTS("#2"), UTS("#3"), UTS("#4"), UTS("#5"), UTS("#6"),
        ...Object.keys(unc).map(Number).filter(x => x >= .25).sort((a, b) => a - b).map(x => UTS(x.toString())),
        ...Object.keys(unf).map(Number).filter(x => x >= .25).sort((a, b) => a - b).map(x => UTS(x.toString(), "fine")),
        ...Object.keys(unef).map(Number).filter(x => x >= .25).sort((a, b) => a - b).map(x => UTS(x.toString(), "extrafine")),
    ].filter(t => t) as Thread[],
};

export default function Root() {
    const [settings, setSettings] = useState<Settings>(() => ({ ...defaults, ...decodeHash(window.location.hash) }));
    const { lengthUnit, pitchUnit, threads } = settings;
    const [newThread, setNewThread] = useState<string>("");
    const update = (next: Settings) => {
        setSettings(next);
        window.history.pushState(null, "", encodeHash(next));
    };
    const addThread = () => {
        const t = Thread(newThread);
        if (t == undefined) {
            alert("Cannot parse thread: \"" + newThread + "\"");
            return;
        }
        update({ ...settings, threads: [...threads, t] });
        setNewThread("");
    };
    useEffect(() => {
        const restore = () => setSettings({ ...defaults, ...decodeHash(window.location.hash) });
        window.addEventListener("popstate", restore);
        window.addEventListener("hashchange", restore);
        return () => {
            window.removeEventListener("popstate", restore);
            window.removeEventListener("hashchange", restore);
        };
    }, []);
    return (
        <>
            <div className="buttonhost">
                <div>
                    <label htmlFor="lengthunits">Length/Diameter/… Unit:&nbsp;</label>
                    <select size={2} id="lengthunits" onChange={x => update({ ...settings, lengthUnit: x.currentTarget.value as LengthUnit })} value={lengthUnit}>
                        <option value="mm">Millimeter</option>
                        <option value="in">Inch</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="pitchunits">Pitch Unit:&nbsp;</label>
                    <select size={2} id="pitchunits" onChange={x => update({ ...settings, pitchUnit: x.currentTarget.value as PitchUnit })} value={pitchUnit}>
                        <option value="tpmm">Threads per Millimeter</option>
                        <option value="tpi">Threads per Inch</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="newthread">Add Thread:&nbsp;</label>
                    <input type="text" value={newThread} id="newthread" onInput={e => setNewThread(e.currentTarget.value)} onKeyDown={e => e.key == "Enter" && addThread()} />
                    <input type="button" value="+ Add" onClick={_ => addThread()} />
                </div>
                <input type="button" value="Clear All Threads" onClick={_ => update({ ...settings, threads: [] })} />
            </div>
            <Table {...{ lengthUnit, pitchUnit, threads }} />
        </>
    );
}
