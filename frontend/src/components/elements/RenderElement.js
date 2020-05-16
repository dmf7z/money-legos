import React, { useRef, useEffect } from "react";

import InputStack from "./InputStack";
import OperationStack from "./OperationStack";
import EmptyStack from "./EmptyStack";
import NewInitStack from "./NewInitStack";
import SplitterStack from "./SplitterStack";
import AddressStack from "./AddressStack";

function RenderElement(props) {
  switch (props.type) {
    case "InputElement":
      return <InputStack {...props} />;
    case "OperationElement":
      return <OperationStack {...props} />;
    case "SplitterElement":
      return <SplitterStack {...props} />;
    case "AddressElement":
      return <AddressStack {...props} />;
    case "EmptyElement":
      return <EmptyStack {...props} />;
  }
}

export default RenderElement;
