import React, { useEffect, useState } from "react";
import { ArcherElement } from "react-archer";
import { arrowStyle } from "../../styles/graphStyles";
import { isEmpty } from "lodash";

const DEMO = {
  targetId: '',
  targetAnchor: "top",
  sourceAnchor: "bottom",
  arrowThickness: 2,
  style: arrowStyle,
}

function SplitterStack(props) {
  const [targetRelation, setTargetRelation] = useState([]);
  let relationArray = []

  const {target, id, asset} = props

  useEffect(() => {

    for(const tar of target) {
      relationArray.push({
        targetId: tar,
        targetAnchor: "top",
        sourceAnchor: "bottom",
        arrowThickness: 2,
        style: arrowStyle,
      }
      );
    }
    setTargetRelation(relationArray)
    console.log(relationArray)

  }, [target]);
  


  return (
    <ArcherElement
      id={props.id}
      className="box"
      relations={targetRelation}
    >
      <div className=" stack--square box box--square">
        <div className={`stack-color stack-color--${props.asset}`}>
          <div className="stack-color__square stack-color__lighten  round--left"></div>
          <div className="stack-color__square stack-color__darken  round--right"></div>
          <img
            className="round--img"
            // src={require(`../../assets/icons/${props.asset}.svg`)}
          ></img>
        </div>
        <div className="stack--round stack-color__content">
          <div className="stack-color__name">SPLIT  50% / 50%</div>
        </div>
      </div>
    </ArcherElement>
  );
}

export default SplitterStack;
