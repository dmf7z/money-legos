import React, { useState, createContext, useEffect, useReducer } from "react";
import { uiReducer } from "./uiReducer";
import { graphReducer } from "./graphReducer";
import * as factory from "library";
// import elements from 'library'
let initialUiStack = [];

// const factory = require('library');
let startGraph = factory.createGraph();

// TEST element
let element;
// element = factory.getElements().INPUT_DAI;
// startGraph.addElement(element, 0, 0);

// element = factory.getElements().INPUT_ETH;
// let id2 = startGraph.addElement(element, 0, 0);

// element = factory.getElements().INPUT_ETH;
// startGraph.addElement(element, 2, 0);

// element = factory.getElements().OP_UNISWAP_ETH_TO_DAI;
// let id8 = startGraph.connectElements([[id2, 0, 0]], element, 0, 1);

// element = factory.getElements().ADDRESS;
// startGraph.connectElements([[id8, 0, 1]], element, 0, 2);


const StackContext = createContext(null);

const StackProvider = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [uiStack, dispatchUi] = useReducer(uiReducer, initialUiStack);
  const [graph, dispatchGraph] = useReducer(graphReducer, startGraph);
  const [limitColumn, setLimitColumn] = useState(0);
  const [graphIsLoaded, setGraphIsLoaded] = useState(false);
  const [graphIsReady, setGraphIsReady] = useState(false);

  useEffect(() => {
    console.log("TOTAL GRAPG: ", JSON.stringify(graph.elements));
    console.log("Limit: ",limitColumn)
  }, [graph, limitColumn]);

  async function deployGraph(web3){
    console.log('deployGraph action')
    const address = await graph.deploy(web3) 
    console.log(address)
    return address
  }

  // 0xd176f11B673594698722c761BB5E9ce6C38207D1

  async function loadGraphAddress(web3, address){
    console.log('Loading graph...', web3, address)
    const loadedGraph = await factory.loadGraph(web3, address);
    setGraphIsLoaded(true)
    console.log(loadedGraph)
    return loadedGraph
  }

  async function checkElement(web3, id){
    let result = await graph.isElementReadyToExecute(web3, id);
    console.log('checking element...', id, result)
    return result
  }

  async function allowElement(web3, id){
    let result = await graph.allowInputElement(web3, id);
    console.log('Allow element',  id, result)
    return result
  }

  async function isReady(web3){
    let result = await graph.isReadyToExecute(web3)
    console.log('READYYYY???? ', result)
    setGraphIsReady(result)
    return result
  }

  async function executeGraph(web3){
    let result = await graph.execute(web3);
    console.log('EXECUTED ', result)
    setGraphIsReady(result)
    return result
  }

  return (
    <StackContext.Provider
      value={{
        uiStack,
        dispatchUi,
        showModal,
        setShowModal,
        graph,
        dispatchGraph,
        showAvailable,
        setShowAvailable,
        limitColumn,
        setLimitColumn,
        deployGraph,
        loadGraphAddress,
        checkElement,
        graphIsLoaded,
        isReady,
        graphIsReady,
        executeGraph,
        allowElement
      }}
    >
      {props.children}
    </StackContext.Provider>
  );
};

export { StackContext, StackProvider };
