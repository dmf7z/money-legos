import React, { useState, useContext, useEffect } from "react";
import { ArcherElement } from "react-archer";
import { arrowStyle } from "../../styles/graphStyles";
import { StackContext } from "../../contexts/stack";
import { isEmpty } from "lodash";

function OperationStack(props) {
  const [selected, setSelected] = useState(false);
  const { dispatchStack, setShowModal, stack } = useContext(StackContext);

  const handleClick = (id) => {
    if (selected) {
      dispatchStack({ type: "UNSELECT_STACK", id });
    } else {
      dispatchStack({ type: "SELECT_STACK", id });
    }
    setSelected(!selected);
    setShowModal(!selected);
  };

  useEffect(() => {
    let available = stack.filter((obj) => obj.id == props.id);
    setSelected(!isEmpty(available));
  }, [stack]);

  return (
    <ArcherElement
      id={props.id}
      relations={
        props.target && [
          {
            targetId: props.target,
            targetAnchor: "top",
            sourceAnchor: "bottom",
            arrowThickness: 2,
            style: arrowStyle,
          },
        ]
      }
    >
      <div onClick={() => handleClick(props.id)}>
        <div
          className={`stack stack--square box box--square ${
            selected && "selection__box"
          }`}
        >
          <div className={`stack-color stack-color--${props.assetIn}`}>
            <div className="stack-color__square stack-color__lighten stack-color__lighten--in">
              {props.assetIn.toUpperCase()}
            </div>
            <div className="stack-color__square stack-color__darken stack-color__darken--in">
              <img src={require(`../../assets/icons/${props.assetIn}.svg`)}></img>
            </div>
          </div>
          <div className={`stack-color  stack-color--${props.assetOut}`}>
            <div className="stack-color__square stack-color__lighten stack-color__lighten--out">
              {props.assetOut.toUpperCase()}
            </div>
            <div className="stack-color__square stack-color__darken stack-color__darken--out">
              <img src={require(`../../assets/icons/${props.assetOut}.svg`)}></img>
            </div>
          </div>
        </div>
      </div>
    </ArcherElement>
  );
}

export default OperationStack;
