import React, { useEffect, useState, useContext, Children } from "react";
import { arrowStyle } from "../../styles/graphStyles";
import { ArcherElement } from "react-archer";
import { StackContext } from "../../contexts/stack";
import { isEmpty } from "lodash";
import { ASSETS_NAMES } from "../../constants";

function WrapperStack(props) {
  const { connections, id, outputs, type } = props;
  const [targetRelation, setTargetRelation] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const { dispatchUi, setShowModal, uiStack } = useContext(StackContext);

  let relationArray = [];

  useEffect(() => {
      // console.log('Connetion', id, connections)
    for (const con of connections) {
      relationArray.push({
        targetId: con.id,
        targetAnchor: "top",
        sourceAnchor: "bottom",
        arrowThickness: 2,
        style: arrowStyle,
      });

    }
    let available = uiStack && uiStack.filter((obj) => obj == props.id);
    setIsSelected(!isEmpty(available));
    setTargetRelation(relationArray);
  }, [uiStack, connections]);

  const handleSelect = () => {
      console.log('Wrapped click:', id)
    if (isSelected) {
        dispatchUi({ type: "UNSELECT_ELEMENT", id });
    } else {
        dispatchUi({ type: "SELECT_ELEMENT", id });
    }
    setIsSelected(!isSelected);
    setShowModal(!isSelected);
  };


//   useEffect(() => {
//     let available = uiStack && uiStack.filter((obj) => obj == props.id);
//     setIsSelected(!isEmpty(available));
//   }, [uiStack]);

  // let asset = outputs && ASSETS_NAMES[outputs[0]].toUpperCase();

  //selected operation
  //   const { dispatchStack, setShowModal, stack } = useContext(StackContext);

  //   const handleClick = (id) => {
  //     if (selected) {
  //       dispatchStack({ type: "UNSELECT_STACK", id });
  //     } else {
  //       dispatchStack({ type: "SELECT_STACK", id });
  //     }
  //     setSelected(!selected);
  //     setShowModal(!selected);
  //   };

  //   useEffect(() => {
  //     let available = stack.filter((obj) => obj.id == props.id);
  //     setSelected(!isEmpty(available));
  //   }, [stack]);
//   console.log('For ID: ', type, ASSETS_NAMES[props.outputs[0]], id, connections.length ,targetRelation.length, relationArray.length)
  
  return (
    <ArcherElement id={id} relations={targetRelation}>
      {React.cloneElement(props.children, { ...props, selectAction: handleSelect, isSelected: isSelected })}
    </ArcherElement>
  );
}

export default WrapperStack;
