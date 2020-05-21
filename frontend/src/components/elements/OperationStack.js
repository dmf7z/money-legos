import React from "react";
import { ASSETS_NAMES, ASSETS_COLORS } from "../../constants";
import { adjustColor } from "../../utils";

const OperationStack = React.forwardRef((props, ref) => {
  // console.log("props op: ", props);
  const { id, outputs, inputs, isSelected } = props;
  let assetIn = ASSETS_NAMES[inputs[0]]
  let assetOut = ASSETS_NAMES[outputs[0]]

  return (
    <div className="stack__common" ref={ref} onClick={props.selectAction}>
      <div
        className={` stack stack--square box box--square ${isSelected &&
          "selection__box"}`}
      >
        <div style={{backgroundColor: adjustColor(ASSETS_COLORS[inputs[0]], 30)}}  className={`stack-color stack-color--${assetIn}`}>
          <div className="stack-color__square stack-color__lighten stack-color__lighten--in">
            {assetIn}
          </div>
          <div style={{backgroundColor: adjustColor(ASSETS_COLORS[inputs[0]], 10)}}  className="stack-color__square stack-color__darken stack-color__darken--in">
            <img src={require(`../../assets/icons/${assetIn}.svg`)}></img>
          </div>
        </div>
        <div  className={`stack-color  stack-color--${assetOut}`}>
          <div style={{backgroundColor: adjustColor(ASSETS_COLORS[outputs[0]], 30)}}  className="stack-color__square stack-color__lighten stack-color__lighten--out">
            {assetOut}
          </div>
          <div style={{backgroundColor: adjustColor(ASSETS_COLORS[outputs[0]],10)}} className="stack-color__square stack-color__darken stack-color__darken--out">
            <img src={require(`../../assets/icons/${assetOut}.svg`)}></img>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OperationStack;
