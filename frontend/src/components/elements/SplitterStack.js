import React, { useEffect, useState } from "react";
import { ArcherElement } from "react-archer";
import { arrowStyle } from "../../styles/graphStyles";
import { isEmpty } from "lodash";
import { ASSETS_COLORS, ASSETS_NAMES } from "../../constants";
import { adjustColor } from "../../utils";

const DEMO = {
  targetId: "",
  targetAnchor: "top",
  sourceAnchor: "bottom",
  arrowThickness: 2,
  style: arrowStyle,
};

const SplitterStack = React.forwardRef((props, ref) => {
  const { id, outputs, inputs, isSelected, executionData } = props;
  let assetIn = ASSETS_NAMES[inputs[0]];

  let percent =  50
  percent = executionData &&  executionData[0].data

  const handleClickInit = () => {
    props.selectAction();
  };

  return (
    <div
      ref={ref}
      onClick={handleClickInit}
      className={`stack__common stack--square box box--square ${isSelected &&
        "selection__box"}`}
    >
      <div className={`stack-color `}>
        <div
          style={{ backgroundColor: adjustColor(ASSETS_COLORS[inputs[0]], 30) }}
          className="stack-color__square stack-color__lighten  round--left"
        ></div>
        <div
          style={{ backgroundColor: adjustColor(ASSETS_COLORS[inputs[0]], 10) }}
          className="stack-color__square stack-color__darken  round--right"
        ></div>
        <img
          className="round--img"
          src={require(`../../assets/icons/${assetIn}.svg`)}
        ></img>
      </div>
      <div className="stack__common stack--round stack-color__content">
        <div className="stack-color__name">
      SPLIT {assetIn} {percent}% / {100-percent}%
        </div>
      </div>
    </div>
  );
});

export default SplitterStack;
