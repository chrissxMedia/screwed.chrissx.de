import Drawing from "./Drawing";
import React from "react";
import ReactDOMClient from "react-dom/client";
import Table from "./Table";
import { M } from "./thread";

function Root() {
    const [useInch, setUseInch] = React.useState(false);
    return (
        <>
            <Drawing />
            <div className="buttonhost">
                <p>millimeters</p>
                <label className="switch">
                  <input type="checkbox" checked={useInch} onChange={x => setUseInch(!useInch)} />
                  <span className="slider round"></span>
                </label>
                <p>inch</p>
            </div>
            <Table unit={useInch ? "inch" : "mm"} threads={[M(1), M(2), M(3), M(4), M(5), M(6), M(8)]} />
            <br />
            <Table unit={useInch ? "inch" : "mm"} threads={[M(1, "fine"), M(2, "fine"), M(3, "fine"), M(4, "fine"), M(5, "fine"), M(6, "fine")]} />
        </>
    );
}

ReactDOMClient.createRoot(document.getElementById("root")!).render(<Root />);
