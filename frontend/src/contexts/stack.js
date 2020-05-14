import React, { useState, createContext, useEffect, useReducer } from "react";
import { stackReducer } from "./stackReducer";
import { graphReducer } from "./graphReducer";

const StackContext = createContext(null);


const StackProvider = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showAvailable, setShowAvailable] = useState(false);
    const [stack, dispatchStack] = useReducer(stackReducer, []);
    const [graph, dispatchGraph] = useReducer(graphReducer, []);
  
    
  
    useEffect(() => {
        console.log('SELECTED ITEMS: ', stack)
        console.log('TOTAL GRAPG: ', graph)
    }, [stack, graph]);
  
    return (
      <StackContext.Provider
        value={{dispatchStack, showModal, setShowModal, stack, dispatchGraph, showAvailable, setShowAvailable}
        }
      >
        {props.children}
      </StackContext.Provider>
    );
  };
  
  export { StackContext, StackProvider };