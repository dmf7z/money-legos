import React, { useEffect, useState, useContext, Children } from "react";
import { arrowStyle } from "../../styles/graphStyles";
import { ArcherElement } from "react-archer";
import { StackContext } from "../../contexts/stack";
import { isEmpty } from "lodash";
import { ASSETS } from "../../constants";

function WrapperStack(props) {
  const { connections, id, outputs } = props;
  const [targetRelation, setTargetRelation] = useState([]);
  const [selected, setSelected] = useState(false);
  const { dispatchStack, setShowModal, stack } = useContext(StackContext);

  let relationArray = [];

  useEffect(() => {
    for (const con of connections) {
      relationArray.push({
        targetId: con,
        targetAnchor: "top",
        sourceAnchor: "bottom",
        arrowThickness: 2,
        style: arrowStyle,
      });
    }
    setTargetRelation(relationArray);
    console.log(relationArray, id);
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

  let asset = ASSETS[outputs[0]].toUpperCase();

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

  return (
    <ArcherElement id={id} relations={targetRelation}>
      {React.cloneElement(props.children, { ...props })}
    </ArcherElement>
  );
}

export default WrapperStack;
