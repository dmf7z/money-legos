import React, { useState, createContext, useEffect, useReducer } from "react";
import { stackReducer } from "./stackReducer";
import { graphReducer } from "./graphReducer";
import * as factory from 'library'
// import elements from 'library'

// const factory = require('library');
let startGraph = factory.createGraph();

// TEST element
let element
element = factory.getElements().INPUT_DAI;
startGraph.addElement(element, 0, 0);

element = factory.getElements().INPUT_WBTC;
let id2 = startGraph.addElement(element, 1, 0);

element = factory.getElements().INPUT_ETH;
startGraph.addElement(element, 2, 0);


element = factory.getElements().OP_UNISWAP_WBTC_TO_ETH;
startGraph.connectElements([[id2, 0]], element, 0, 1, 1);

const StackContext = createContext(null);

const StackProvider = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showAvailable, setShowAvailable] = useState(false);
    const [stack, dispatchStack] = useReducer(stackReducer, []);
    const [graph, dispatchGraph] = useReducer(graphReducer, startGraph);
    
    useEffect(() => {
        // console.log('SELECTED ITEMS: ', stack)
        console.log('TOTAL GRAPG: ', JSON.stringify(graph.elements))
    }, [stack, graph]);

  
    return (
      <StackContext.Provider
        value={{dispatchStack, showModal, setShowModal, stack,graph,  dispatchGraph, showAvailable, setShowAvailable}
        }
      >
        {props.children}
      </StackContext.Provider>
    );
  };
  
  export { StackContext, StackProvider };