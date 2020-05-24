import React from "react";
import { Redirect, Link } from "react-router-dom";
import { ArcherContainer, ArcherElement } from "react-archer";

import "react-toastify/dist/ReactToastify.css";
import { arrowStyle } from "../styles/graphStyles";

function LandingPage() {
  return (
    <section className="hero is-dark is-bold is-fullheight">
      <ArcherContainer
        className={"test3"}
        svgContainerStyle={{ zIndex: 0 }}
        strokeColor="red"
      >
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title has-text-warning">compose.fi</h1>
            <h2 className="subtitle landing__sub">
              Experiments <img src={require("../assets/icons/lab.svg")} /> with
              DeFi
            </h2>
            <div className="has-text-warning subtitle is-6 landing__sub">
              created by{" "}
              <a
                href="https://defire.io"
                className="button is-warning is-small is-outlined landing__link"
              >
                🔥 Defire
              </a>{" "}
              Team
            </div>
            <div className="landing__description">
              <div>
                A didactic tool to visually connect DeFi instruments and learn
                about composability.
              </div>
              {/* For example buy ETH in Uniswap and lend them in Compound. Even
              that the tool is aimed for newcomers to learn about DeFi
              composability, anyone can use it to test protocols, do manual
              arbitrage, check for arbitrage attacks, Zap many operations into
              one, among other things. */}
            </div>
            <div className="landing__description">
              <figure className="image is-16by9">
                <iframe
                  className="has-ratio"
                  width="640"
                  height="360"
                  src="https://www.youtube.com/embed/YE7V32Ltp-4?showsuccess=0"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </figure>
            </div>
            <div className="landing__description">
              <Link to="/new" class="button is-warning is-outlined">
                Create new graph 👉
              </Link>
            </div>
            <div>or load one deployed graph to execute your self</div>
            <ArcherElement
              id={"ex0"}
              relations={[
                {
                  targetId: "ex1",
                  targetAnchor: "top",
                  sourceAnchor: "bottom",
                  arrowThickness: 2,
                  style: arrowStyle,
                },
                {
                  targetId: "ex2",
                  targetAnchor: "top",
                  sourceAnchor: "bottom",
                  arrowThickness: 2,
                  style: arrowStyle,
                },
                {
                  targetId: "ex3",
                  targetAnchor: "top",
                  sourceAnchor: "bottom",
                  arrowThickness: 2,
                  style: arrowStyle,
                },
              ]}
            >
              <div className="landing__action">
                <img src={require("../assets/icons/goo.svg")} />
              </div>
            </ArcherElement>
          </div>
        </div>

        <div className="hero-foot">
          <nav className="tabs is-boxed is-fullwidth">
            <div className="container">
              <ul>
                <li className="has-text-centered">
                  <ArcherElement id={"ex1"}>
                    <button class="button is-danger is-outlined">
                      Donate to 2 address
                    </button>
                  </ArcherElement>
                </li>
                <li className="has-text-centered">
                  <ArcherElement id={"ex2"}>
                    <button class="button is-danger is-outlined">
                    Flash Swap 
                      <img
                        className="modal__op--img-uni"
                        src={require("../assets/icons/uniswapv2.svg")}
                      />{" "}
                      Uniswap v2
                    </button>
                  </ArcherElement>
                </li>
                <li className="has-text-centered">
                  <ArcherElement id={"ex3"}>
                    <button class="button is-danger is-outlined">
                      Trade in Oasis and Curve
                    </button>
                  </ArcherElement>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </ArcherContainer>
      <div className="container landing__questions">
        {/* Q */}
        <h3 class="title is-3 has-text-warning is-spaced">How can I use it?</h3>
        <p class="subtitle is-5 is-spaced">
          Simply connect the DeFi pieces manually, create the graph and execute
          it! Check this example:{" "}
        </p>
        <img
          className="is-fullwidth"
          src={require("../assets/demo/gif1b.gif")}
        />
        {/* Q */}
        <p class="subtitle is-5 is-spaced"></p>
        <h3 class="title is-3 has-text-warning is-spaced">How does it work?</h3>
        <p class="subtitle is-5 is-spaced">
          A graph is deployed and executed as a smart contract. There is no
          central db involved, just writing/reading blockchain data.
        </p>
        {/* Q */}
        <h3 class="title is-3 has-text-warning is-spaced">Who is this for?</h3>
        <p class="subtitle is-5 is-spaced">
          Teachers, students, newcomers, devs. This is a tool that anyone can
          use to play, learn, teach DeFi composability or even create custom
          snaps.
        </p>
        <h3 class="title is-3 has-text-warning is-spaced">
          Why did you built it?
        </h3>
        <p class="subtitle is-5 is-spaced">
          This was built for{" "}
          <a className="is-text landing__link" href="https://ethglobal.online/">
            HackMoney hackathon
          </a>
          .
        </p>
        <h3 class="title is-3 has-text-warning is-spaced">
          Who is behind this project?
        </h3>
        <p class="subtitle is-5 is-spaced">
          <a className="is-text landing__link" href="https://brunobalzani.com">
            Bruno Balzani
          </a>{" "}
          and{" "}
          <a
            className="is-text landing__link"
            href="https://www.linkedin.com/in/dmf7z"
          >
            Daniel Fernandez{" "}
          </a>
        </p>
        <h3 class="title is-3 has-text-warning is-spaced">What's next?</h3>
        <p class="subtitle is-5 is-spaced">
          Oh well, if people like it, we promise to add more instruments.
        </p>

        <h3 class="title is-3 has-text-warning is-spaced">🚨 Caution! Use at your own risk!</h3>
        <p class="subtitle is-5 is-spaced">
          Its on mainnet
        </p>
      </div>
    </section>
  );
}

export default LandingPage;
