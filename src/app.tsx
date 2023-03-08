import Drawing from "./Drawing";
import React from "react";
import ReactDOMClient from "react-dom/client";
import Table from "./Table";
import { M, uts } from "./thread";

function Root() {
    const [useInch, setUseInch] = React.useState(false);
    const [tpu, setTpu] = React.useState(false);
    return (
        <>
            <Drawing />
            <div className="buttonhost">
                <div className="buttonhost">
                    <p>millimeters</p>
                    <label className="switch">
                        <input type="checkbox" checked={useInch} onChange={x => setUseInch(!useInch)} />
                        <span className="slider round"></span>
                    </label>
                    <p>inch</p>
                </div>
                <div className="interbuttonspacer" />
                <div className="buttonhost">
                    <p>0.5mm</p>
                    <label className="switch">
                        <input type="checkbox" checked={tpu} onChange={x => setTpu(!tpu)} />
                        <span className="slider round"></span>
                    </label>
                    <p>2mm<sup>-1</sup></p>
                </div>
            </div>
            <Table unit={useInch ? "inch" : "mm"} tpu={tpu} threads={[M(1), M(2), M(3), M(4), M(5), M(6), M(8)]} />
            <br />
            <Table unit={useInch ? "inch" : "mm"} tpu={tpu} threads={[M(1, "fine"), M(2, "fine"), M(3, "fine"), M(4, "fine"), M(5, "fine"), M(6, "fine")]} />
            <br />
            <Table unit={useInch ? "inch" : "mm"} tpu={tpu} threads={[uts("#000", 120), uts("#00", 90), uts("#0", "fine")]} />
            <br />
            <Table unit={useInch ? "inch" : "mm"} tpu={tpu} threads={[uts("#1"), uts("#2"), uts("#3"), uts("#4"), uts("#5"), uts("#6")]} />
        </>
    );
}

ReactDOMClient.createRoot(document.getElementById("root")!).render(<Root />);
