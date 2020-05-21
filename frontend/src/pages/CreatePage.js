import React, {
  useState,
  createContext,
  useEffect,
  useReducer,
  useContext,
} from "react";
import ModalAction from "../components/ModalAction";
import FactoryGraph from "../components/FactoryGraph";
import { Web3Context, Web3Toolbar } from "@dapperlabs/react-web3";
import { StackContext } from "../contexts/stack";

function CreatePage() {
  const {
    checkingForWeb3,
    web3,
    account,
    network,
    getAccounts,
    requestAccounts,
  } = useContext(Web3Context);
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);

  useEffect(() => {
    setIsWeb3Enabled(checkingForWeb3);
    console.log("checkingForWeb3", checkingForWeb3);
    console.log("checkingForWeb3", account);
  }, []);

  const { deployGraph } = useContext(StackContext);

  const requestAccess = () => {
    console.log("click");
    requestAccounts().then((res) => setIsWeb3Enabled(true));
  };

  const doTheDeploy = () => {
    console.log("click doTheDeploy");
    requestAccounts().then((res) => {
      deployGraph(web3);
    });
  };

  return (
    <section className="view">
      <div id="main" className="container">
        <div className="header">
          <div>
            <h1 className="title is-3 has-text-warning">compose.fi</h1>
            <h2 className="subtitle">Experiments 🧪 with DeFi</h2>
            <span class="tag is-danger is-light is-small">
              🚨 Caution! Use at your own risk!{" "}
            </span>
          </div>
          <div>
            {isWeb3Enabled ? (
              <button
                onClick={() => doTheDeploy()}
                class="button is-warning is-outlined"
              >
                Deploy Graph
              </button>
            ) : (
              <button
                onClick={() => requestAccess()}
                class="button is-warning is-outlined"
              >
                Connect Metamask
              </button>
            )}
          </div>
        </div>
      </div>
      <FactoryGraph />

      <ModalAction />
    </section>
  );
}

export default CreatePage;
