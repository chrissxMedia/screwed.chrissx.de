import Drawing from "./Drawing";
import React from "react";
import ReactDOMClient from "react-dom/client";
import Table, { LengthUnit, PitchUnit } from "./Table";
import { M, UTS } from "./thread";

function Root() {
    const [lengthUnit, setLengthUnit] = React.useState<LengthUnit>("mm");
    const [pitchUnit, setPitchUnit] = React.useState<PitchUnit>("tpi");
    return (
        <>
            <Drawing />
            <div className="buttonhost">
                <label htmlFor="lengthunits">Length/Diameter/… Unit:&nbsp;</label>
                <select id="lengthunits" onChange={x => setLengthUnit(x.target.value as LengthUnit)}>
                    <option value="mm">Millimeter</option>
                    <option value="inch">Inch</option>
                </select>
                <div className="interbuttonspacer" />
                <label htmlFor="pitchunits">Pitch Unit:&nbsp;</label>
                <select id="pitchunits" onChange={x => setPitchUnit(x.target.value as PitchUnit)}>
                    <option value="tpmm">Threads per Millimeter</option>
                    <option value="tpi">Threads per Inch</option>
                </select>
            </div>
            <br />
            <Table lengthUnit={lengthUnit} pitchUnit={pitchUnit} threads={[M(1), M(2), M(3), M(4), M(5), M(6), M(8)]} />
            <br />
            <Table lengthUnit={lengthUnit} pitchUnit={pitchUnit} threads={[M(1, "fine"), M(2, "fine"), M(3, "fine"), M(4, "fine"), M(5, "fine"), M(6, "fine")]} />
            <br />
            <Table lengthUnit={lengthUnit} pitchUnit={pitchUnit} threads={[UTS("#000", 120), UTS("#00", 90), UTS("#0", "fine")]} />
            <br />
            <Table lengthUnit={lengthUnit} pitchUnit={pitchUnit} threads={[UTS("#1"), UTS("#2"), UTS("#3"), UTS("#4"), UTS("#5"), UTS("#6")]} />
        </>
    );
}

ReactDOMClient.createRoot(document.getElementById("root")!).render(<Root />);
