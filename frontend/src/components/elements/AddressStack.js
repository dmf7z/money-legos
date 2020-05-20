import React from "react";
import IdenticonAddress from "../IdenticonAddress";
import { ASSETS_NAMES } from "../../constants";

const AddressStack = React.forwardRef((props, ref) => {
  const { id, outputs, inputs, isSelected } = props;
  console.log(props);
  let assetIn = ASSETS_NAMES[inputs[0]];
  const handleClickInit = () => {
    props.selectAction();
  };

  return (
    <div
      ref={ref}
      onClick={handleClickInit}
      className="stack__common stack--square box box--square"
    >
      <div className=" stack stack-color__content">
        <div className="stack-color__address">
          <div>Address</div>
          <IdenticonAddress address={ASSETS_NAMES[assetIn]} />
        </div>
      </div>
    </div>
  );
});

export default AddressStack;
