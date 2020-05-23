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

function CreatePage() {
  const {
    checkingForWeb3,
    web3,
    network,
    getAccounts,
  } = useContext(Web3Context);
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [loadedGraph, setLoadedGraph] = useState([]);

  useEffect(async () => {
    const account = await getAccounts();
    setHasAccount(!isEmpty(account));
    setIsWeb3Enabled(checkingForWeb3);
    console.log("checkingForWeb3", checkingForWeb3);
    console.log("isEmpty(account)", isEmpty(account));
  }, []);

  const { deployGraph, limitColumn, loadGraph } = useContext(StackContext);
 
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

      // ...code
    } catch (error) {
      console.error(error);
    }
  }

  const doTheDeploy = () => {
    console.log("click doTheDeploy");
    deployGraph(web3);
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
            {hasAccount ? (
              <button
                onClick={() => doTheDeploy()}
                class="button is-warning is-outlined"
              >
                Deploy Graph 
              </button>
            ) : (
              <button
                onClick={() => mmReq()}
                class="button is-warning is-outlined"
              >
                Connect Metamask
              </button>
            )}
          </div>
        </div>
      </div>
      <FactoryGraph graph={loadedGraph} />

      <ModalAction />
    </section>
  );
}

export default CreatePage;
