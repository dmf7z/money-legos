import React, { useState, useEffect, useContext } from "react";

import { StackContext } from "../../contexts/stack";

function EmptyStack(props) {
  const [isAvailable, setIsAvailable] = useState(false);

  const { showAvailable, dispatchGraph, setShowAvailable } = useContext(
    StackContext
  );
  
  let element =   {
      id: "stack00-01",
      type: "OperationElement",
      input: "wbtc",
      output: "eth",
      connections: ["stack02-02"],
      index: props.element.index
    }

  const handleClick = (id) => {
    if (isAvailable) {
      dispatchGraph({ type: "CHANGE_STACK", element });
    } 
    setShowAvailable(!isAvailable);
    setIsAvailable(!isAvailable);
  };


  useEffect(() => {
    setIsAvailable(showAvailable);
  }, [showAvailable]);

  return (
    <div onClick={() => handleClick()} className={isAvailable ? "stack--new stack--square box box--square": "box box--space"}>
     
    </div>
  );
}

export default EmptyStack;
