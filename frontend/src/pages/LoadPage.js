import React, {
  useState,
  createContext,
  useEffect,
  useReducer,
  useContext,
} from "react";
import ModalAction from "../components/ModalAction";
import FactoryGraph from "../components/FactoryGraph";
import { Web3Context } from "@dapperlabs/react-web3";
import { isEmpty } from "lodash";
import { StackContext } from "../contexts/stack";
import { isAddress } from "../utils";
import { useWeb3Injected } from "@openzeppelin/network/react";
import { ToastContainer, toast } from "react-toastify";

export default function LoadPage({ match }) {
  const {
    checkingForWeb3,
    web3,
    account,
    network,
    getAccounts,
    requestAccounts,
  } = useContext(Web3Context);
  const injected = useWeb3Injected();
  // const { accounts, networkId, networkName, providerName, lib, connected } = web3Context();
  // const {web3, checking} = useInjectedWeb3()
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [loadedGraph, setLoadedGraph] = useState([]);
  const {
    dispatchGraph,
    loadGraphAddress,
    graph,
    graphIsReady,
    isReady,
    executeGraph,
    graphIsLoaded,
  } = useContext(StackContext);

  let { address } = match.params;
  // console.log(address, web3);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("account", injected);
        setHasAccount(!isEmpty(injected.accounts));
        let lg = await loadGraphAddress(web3, address);
        dispatchGraph({ type: "LOAD_GRAPH", lg });

        setLoadedGraph(lg);
      } catch (error) {
        console.log(error);
      }
    };
    if (!graphIsLoaded) {
      init();
    }
  }, [injected.connected]);

  useEffect(() => {
    const check = async () => {
      try {
        console.log("account", injected);
        isReady(web3);
      } catch (error) {
        console.log(error);
      }
    };
    check();
  }, [graph]);

  async function mmReq() {
    try {
      window.ethereum
        .enable()
        .then(function (account) {
          console.log(account);
          setHasAccount(!isEmpty(account));
        })
        .catch(function (reason) {
          // Handle error. Likely the user rejected the login:
          console.log(reason === "User rejected provider access");
        });
    } catch (error) {
      console.error(error);
    }
  }

  const doTheExecute = async () => {
    console.log("click EXECUTE");
    try {
      let result = await executeGraph(web3);

      console.log(result);
      toast(`${result}`);
    } catch (error) {
      toast.error("Oppps");
    }
  };

  const doCheck = async () => {
    console.log("click Checking");
    try {
      let result = await isReady(web3);
      console.log(result);
      let msg = result ? "Its ready!" : "Graph not ready :("
      toast(`Perfect!: ${msg}`);
    } catch (error) {
      toast.error("Oppps");
    }
  };

  return (
    <section className="view">
      <div id="main" className="container">
        <div className="header">
          <div>
            <h1 className="title is-3 has-text-warning">compose.fi</h1>
            <h2 className="subtitle landing__icon">Experiments <img src={require("../assets/icons/lab.svg")} /> with with DeFi</h2>
            <span class="tag is-danger is-light is-small">
              🚨 Caution! Use at your own risk!{" "}
            </span>
          </div>
          <div>
            {!hasAccount && (
              <button
                onClick={() => mmReq()}
                class="button is-warning is-outlined"
              >
                Connect Metamask
              </button>
            )}
            {graphIsReady && (
              <button
                onClick={() => doTheExecute()}
                class="button is-warning is-outlined"
              >
                Ready to EXECUTE 🏃‍♀
              </button>
            )}
             {!graphIsReady && (
              <button
              onClick={() => doCheck()}

                class="button is-warning is-outlined is-disabled"
              >
                Check graph 
              </button>
            )}
          </div>
        </div>
      </div>
      {hasAccount && <FactoryGraph />}
      {!hasAccount && <div>Sorry, we need Metamask</div>}

      <ModalAction />
      <ToastContainer />

    </section>
  );
}
