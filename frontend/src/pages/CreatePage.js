import React, {
  useState,
  createContext,
  useEffect,
  useReducer,
  useContext,
} from "react";
import { Redirect } from "react-router-dom";
import ModalAction from "../components/ModalAction";
import FactoryGraph from "../components/FactoryGraph";
import { Web3Context } from "@dapperlabs/react-web3";
import { isEmpty } from "lodash";
import { StackContext } from "../contexts/stack";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function 
CreatePage() {
  const { checkingForWeb3, web3, network, getAccounts } = useContext(
    Web3Context
  );
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [successDeploy, setSuccessDeploy] = useState(false);
  const [loadedGraph, setLoadedGraph] = useState([]);
  const [deployedContract, setDeployedContract] = useState(null);

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

  const doTheDeploy = async () => {
    console.log("click doTheDeploy");
    try {
      let result = await deployGraph(web3);
      console.log(result);
      toast(`Wow, Its alive: ${result}`);
      setTimeout(() => {
        setDeployedContract(result);
        setSuccessDeploy(true);
        window.location.href = `/load/${result}`;
      }, 5000);
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
      <ToastContainer />
    </section>
  );
}

export default CreatePage;
