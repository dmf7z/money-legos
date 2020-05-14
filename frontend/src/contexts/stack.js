import React, { useState, createContext, useEffect, useReducer } from "react";
import { stackReducer } from "./stackReducer";

const StackContext = createContext(null);


const StackProvider = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [stack, dispatchStack] = useReducer(stackReducer, []);
  
    
  
    useEffect(() => {
        console.log('SELECTED ITEMS: ', stack.length)
    }, [stack]);
  
    return (
      <StackContext.Provider
        value={{dispatchStack, showModal, setShowModal, stack}
        }
      >
        {props.children}
      </StackContext.Provider>
    );
  };
  
  export { StackContext, StackProvider };