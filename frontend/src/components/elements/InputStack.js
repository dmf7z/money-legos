import React, { useEffect, useState, useContext } from "react";
import { arrowStyle } from "../../styles/graphStyles";
import { ArcherElement } from "react-archer";
import { StackContext } from "../../contexts/stack";
import { isEmpty } from "lodash";
import { ASSETS } from "../../constants";

function InputStack(props) {
  console.log(props)
  const {connections, id, outputs} = props
  const [targetRelation, setTargetRelation] = useState([]);
  const [selected, setSelected] = useState(false);
  const { dispatchStack, setShowModal, stack } = useContext(StackContext);

  let relationArray = []

  useEffect(() => {
    for(const con of connections) {
      relationArray.push({
        targetId: con,
        targetAnchor: "top",
        sourceAnchor: "bottom",
        arrowThickness: 2,
        style: arrowStyle,
      });
    }
    setTargetRelation(relationArray)

  }, [connections]);

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

  let asset = ASSETS[outputs[0]].toUpperCase()

  return (
    <ArcherElement
      id={id}
      relations={targetRelation}
    >
      <div  onClick={() => handleClick(props.id)}>
        <div className={`stack stack--square box box--square ${
            selected && "selection__box"
          }`}>
          <div className="stack-color__content">
            <div className="stack-color__name">START WITH {asset}</div>
          </div>
          <div className={`stack-color stack-color--${asset.toLowerCase()}`}>
            <div className="stack-color__square stack-color__lighten stack-color__lighten--out">
              {asset}
            </div>
            <div className="stack-color__square stack-color__darken stack-color__darken--out">
              <img src={require(`../../assets/icons/${asset.toLowerCase()}.svg`)}></img>
            </div>
          </div>
        </div>
      </div>
    </ArcherElement>
  );
}

export default InputStack;
