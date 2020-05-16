import React, { useRef, useEffect } from "react";

import InputStack from "./InputStack";
import OperationStack from "./OperationStack";
import EmptyStack from "./EmptyStack";
import NewInitStack from "./NewInitStack";
import SplitterStack from "./SplitterStack";
import AddressStack from "./AddressStack";
import WrapperStack from "./WrapperStack";



function RenderElement(props) {
  switch (props.type) {
    case "InputElement":
      return <WrapperStack {...props} ><InputStack {...props} /></WrapperStack> ;
    case "OperationElement":
      return <WrapperStack {...props} ><OperationStack {...props} /></WrapperStack>;
    case "SplitterElement":
      return <SplitterStack {...props} />;
    case "AddressElement":
      return <AddressStack {...props} />;
    case "EmptyElement":
      return <EmptyStack {...props} />;
  }
}

export default RenderElement;
