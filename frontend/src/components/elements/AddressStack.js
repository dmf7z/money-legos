import React from "react";
import IdenticonAddress from "../IdenticonAddress";
import { ASSETS_NAMES } from "../../constants";

const AddressStack = React.forwardRef((props, ref) => {
  const { id, outputs, inputs, isSelected, isReady, graphIsLoaded } = props;

  console.log(props);
  let address = props.executionData[0] ? props.executionData[0].data : "";
  const handleClickInit = () => {
    props.selectAction();
  };

  return (
    <div
      ref={ref}
      onClick={handleClickInit}
      className="stack__common stack--square box box--square"
    >
      {graphIsLoaded && (
        <div className="stack__icon--address">{isReady ? "✅" : "❌"}</div>
      )}
      <div className=" stack stack-color__content">
        <div className="stack-color__address">
          <div>Address</div>
          <IdenticonAddress address={address} />
        </div>
      </div>
    </div>
  );
});

export default AddressStack;
