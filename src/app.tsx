import React from "react";
import ReactDOMClient from "react-dom/client";
import Table from "./Table";
import { M } from "./thread";

function Root() {
    return <Table unit="mm" threads={[M(1), M(2), M(3), M(4), M(5), M(6), M(8)]}></Table>;
}

ReactDOMClient.createRoot(document.getElementById("root")!).render(<Root />);
