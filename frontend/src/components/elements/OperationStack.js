import React from "react";
import { ASSETS_NAMES } from "../../constants";

const OperationStack = React.forwardRef((props, ref) => {
  // console.log("props op: ", props);
  const { id, outputs, inputs, isSelected } = props;
  let assetIn = ASSETS_NAMES[inputs[0]].toLowerCase();
  let assetOut = ASSETS_NAMES[outputs[0]].toLowerCase();

  return (
    <div ref={ref} onClick={props.selectAction}>
      <div
        className={`stack stack--square box box--square ${isSelected &&
          "selection__box"}`}
      >
        <div className={`stack-color stack-color--${assetIn}`}>
          <div className="stack-color__square stack-color__lighten stack-color__lighten--in">
            {assetIn.toUpperCase()}
          </div>
          <div className="stack-color__square stack-color__darken stack-color__darken--in">
            <img src={require(`../../assets/icons/${assetIn}.svg`)}></img>
          </div>
        </div>
        <div className={`stack-color  stack-color--${assetOut}`}>
          <div className="stack-color__square stack-color__lighten stack-color__lighten--out">
            {assetOut.toUpperCase()}
          </div>
          <div className="stack-color__square stack-color__darken stack-color__darken--out">
            <img src={require(`../../assets/icons/${assetOut}.svg`)}></img>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OperationStack;
