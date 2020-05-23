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

element = factory.getElements().INPUT_ETH;
let id2 = startGraph.addElement(element, 0, 0);

// element = factory.getElements().INPUT_ETH;
// startGraph.addElement(element, 2, 0);

element = factory.getElements().OP_UNISWAP_ETH_TO_DAI;
let id8 = startGraph.connectElements([[id2, 0, 0]], element, 0, 1);

// element = factory.getElements().ADDRESS;
// startGraph.connectElements([[id8, 0, 1]], element, 0, 2);


const StackContext = createContext(null);

const StackProvider = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [uiStack, dispatchUi] = useReducer(uiReducer, initialUiStack);
  const [graph, dispatchGraph] = useReducer(graphReducer, startGraph);
  const [limitColumn, setLimitColumn] = useState(0);

  useEffect(() => {
    console.log("SELECTED ITEMS: ", uiStack);
    console.log("TOTAL GRAPG: ", JSON.stringify(graph.elements));
    console.log("TOTAL GRAPG: ",limitColumn)
  }, [uiStack, graph, limitColumn]);

  async function deployGraph(web3){
    console.log('deployGraph action')
    const address = await graph.deploy(web3) 
    console.log(address)
  }

  // 0xd176f11B673594698722c761BB5E9ce6C38207D1

  async function loadGraph(web3, address){
    console.log('deployGraph action')
    const loadedGraph = await factory.loadGraph(web3, address);
    console.log(loadedGraph)
    return loadedGraph
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
        loadGraph
      }}
    >
      {props.children}
    </StackContext.Provider>
  );
};

export { StackContext, StackProvider };
