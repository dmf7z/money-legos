import React, { useRef, useEffect } from "react";

import InputStack from "./InputStack";
import OperationStack from "./OperationStack";
import EmptyStack from "./EmptyStack";
import NewInitStack from "./NewInitStack";
import SplitterStack from "./SplitterStack";
import AddressStack from "./AddressStack";

function selectElement(element) {
  switch (element.type) {
    case "InputElement":
      return (
        <InputStack
          id={element.id}
          asset={element.output}
          target={element.connections}
          element={element}
        />
      );
    case "OperationElement":
      return (
        <OperationStack
          id={element.id}
          assetIn={element.input}
          assetOut={element.output}
          target={element.connections}
          element={element}
        />
      );
    case "SplitterElement":
      return (
        <SplitterStack
          id={element.id}
          asset={element.output}
          target={element.connections}
          element={element}
        />
      );
    case "AddressElement":
          
          return <AddressStack id={element.id} address={element.address} element={element} />;
    case "EmptyElement":
      return <EmptyStack element={element} />;
  }
}

export default selectElement;
