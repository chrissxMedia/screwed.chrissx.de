import Drawing from "./Drawing";
import React from "react";
import ReactDOMClient from "react-dom/client";
import Table, { LengthUnit, PitchUnit } from "./Table";
import { M, mCoarse, mFine, UTS } from "./Thread";

function Root() {
    // this is the ugliest hack ever
    console.log(M(4));
    const [lengthUnit, setLengthUnit] = React.useState<LengthUnit>("mm");
    const [pitchUnit, setPitchUnit] = React.useState<PitchUnit>("tpi");
    const threads = [
        ...Object.keys(mCoarse).map(Number).sort((a, b) => a - b).map(x => M(x, "coarse")),
        ...Object.keys(mFine).map(Number).sort((a, b) => a - b).map(x => M(x, "fine")),
        UTS("#000", 120), UTS("#00", 90), UTS("#0", "fine"),
        UTS("#1"), UTS("#2"), UTS("#3"), UTS("#4"), UTS("#5"), UTS("#6"),
    ];
    //window.location.hash = "#" + JSON.stringify({lengthUnit, pitchUnit, threads});
    //console.log(JSON.parse(decodeURIComponent(window.location.hash.substring(1))));
    return (
        <>
            <Drawing />
            <div className="buttonhost">
                <label htmlFor="lengthunits">Length/Diameter/… Unit:&nbsp;</label>
                <select id="lengthunits" onChange={x => setLengthUnit(x.target.value as LengthUnit)} value={lengthUnit}>
                    <option value="mm">Millimeter</option>
                    <option value="inch">Inch</option>
                </select>
                <div className="interbuttonspacer" />
                <label htmlFor="pitchunits">Pitch Unit:&nbsp;</label>
                <select id="pitchunits" onChange={x => setPitchUnit(x.target.value as PitchUnit)} value={pitchUnit}>
                    <option value="tpmm">Threads per Millimeter</option>
                    <option value="tpi">Threads per Inch</option>
                </select>
            </div>
            <br />
            <Table {...{lengthUnit, pitchUnit, threads}} />
        </>
    );
}

ReactDOMClient.createRoot(document.getElementById("root")!).render(<Root />);
