import React, { useRef, useEffect } from "react";

import InputStack from "./InputStack";
import OperationStack from "./OperationStack";
import EmptyStack from "./EmptyStack";
import NewInitStack from "./NewInitStack";
import SplitterStack from "./SplitterStack";
import AddressStack from "./AddressStack";
import FlashStack from "./FlashStack";
import WrapperStack from "./WrapperStack";

function RenderElement(props) {
  switch (props.type) {
    case "InputElement":
      return (
        <WrapperStack {...props}>
          <InputStack {...props} />
        </WrapperStack>
      );

    case "OperationElement":
      return (
        <WrapperStack {...props}>
          <OperationStack {...props} />
        </WrapperStack>
      );
    case "SplitterElement":
      return (
        <WrapperStack {...props}>
          <SplitterStack {...props} />
        </WrapperStack>
      );

    case "AddressElement":
      return (
        <WrapperStack {...props}>
          <AddressStack {...props} />
        </WrapperStack>
      );
    case "FlashSwapOut":
      return (
        <WrapperStack {...props}>
          <FlashStack {...props} />
        </WrapperStack>
      );
      case "FlashSwapIn":
        return (
          <WrapperStack {...props}>
            <FlashStack {...props} />
          </WrapperStack>
        );
    case "NewInitStack":
      return (
        <WrapperStack {...props}>
          <NewInitStack {...props} />
        </WrapperStack>
      );
    case "EmptyElement":
      return <EmptyStack {...props} />;
  }
}

export default RenderElement;
