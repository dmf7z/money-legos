import React, { useState, useContext, useEffect } from "react";
import { ArcherElement } from "react-archer";
import { arrowStyle } from "../../styles/graphStyles";
import { StackContext } from "../../contexts/stack";
import { isEmpty } from "lodash";
import { ASSETS } from "../../constants";

const OperationStack = React.forwardRef((props, ref) => {

  const { id, outputs, inputs} = props
  let selected = false
  let assetIn = ASSETS[inputs[0]].toLowerCase()
  let assetOut = ASSETS[outputs[0]].toLowerCase()

  return (
    
      <div ref={ref} onClick={() => console.log(props.id)}>
        <div
          className={`stack stack--square box box--square ${
            selected && "selection__box"
          }`}
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
})

export default OperationStack;
