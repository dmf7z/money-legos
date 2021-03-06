import React from "react";
import { ASSETS_NAMES, ASSETS_COLORS } from "../../constants";
import { adjustColor } from "../../utils";

const InputStack = React.forwardRef((props, ref) => {
  let selected = false;
  const {
    id,
    outputs,
    inputs,
    isSelected,
    isReady,
    graphIsLoaded,
    executionData,
  } = props;

  let asset = ASSETS_NAMES[outputs[0]];
  let amount = executionData[1].data;

  return (
    <div className="stack__common" ref={ref} onClick={props.selectAction}>
      {graphIsLoaded && (
        <div className="stack__icon">
          {isReady === true ? (
            <span class="is-normal stack__tag-min">Ready to execute ✅</span>
          ) : (
            <span class="tag is-normal is-danger stack__tag-min">
              {isReady}
            </span>
          )}
        </div>
      )}
      <div
        className={`stack__common stack stack--square box box--square ${
          isSelected && "selection__box"
        }`}
      >
        <div className="stack-color__content">
          <div className="stack-color__name">
            START WITH {graphIsLoaded && amount} {asset}
          </div>
        </div>
        <div className={`stack-color stack-color--${asset}`}>
          <div
            style={{
              backgroundColor: adjustColor(ASSETS_COLORS[outputs[0]], 30),
            }}
            className="stack-color__square stack-color__lighten stack-color__lighten--out"
          >
            {asset}
          </div>
          <div
            style={{
              backgroundColor: adjustColor(ASSETS_COLORS[outputs[0]], 10),
            }}
            className="stack-color__square stack-color__darken stack-color__darken--out"
          >
            <img src={require(`../../assets/icons/${asset}.svg`)}></img>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InputStack;
