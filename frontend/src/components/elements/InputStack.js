import React from "react";
import { ASSETS } from "../../constants";

const InputStack = React.forwardRef((props, ref) => {
  let selected = false;
  let asset = ASSETS[props.outputs[0]].toUpperCase();

  return (
    <div ref={ref}>
      <div
        className={`stack stack--square box box--square ${selected &&
          "selection__box"}`}
      >
        <div className="stack-color__content">
          <div className="stack-color__name">START WITH {asset}</div>
        </div>
        <div className={`stack-color stack-color--${asset.toLowerCase()}`}>
          <div className="stack-color__square stack-color__lighten stack-color__lighten--out">
            {asset}
          </div>
          <div className="stack-color__square stack-color__darken stack-color__darken--out">
            <img
              src={require(`../../assets/icons/${asset.toLowerCase()}.svg`)}
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InputStack;
