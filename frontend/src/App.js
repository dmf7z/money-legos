import React from "react";
import "./App.scss";
import { DONATE_PARTIAL } from "./graph/graph-example";
import FactoryGraphV2 from "./components/FactoryGraphV2";
import ModalAction from "./components/ModalAction";

function App() {
  return (
    <section className="view">
      <div id="main" className="container">
        <div className="header">
          <div>
            <h1 className="title is-3 has-text-warning">compose.fi</h1>
            <h2 className="subtitle">Experiments 🧪 with DeFi </h2>
          </div>
          <span class="tag is-danger is-light is-small">
            🚨 Caution! Use at your own risk!{" "}
          </span>
        </div>
      </div>

      {/*  */}
      <FactoryGraphV2 graph={DONATE_PARTIAL} />

      {/* MAP! */}
      {/* <FactoryGraphV2 graph={DONATE_V2} /> */}

      <ModalAction />
    </section>
  );
}

export default App;
