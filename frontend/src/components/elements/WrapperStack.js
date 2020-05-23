import React, { useEffect, useState, useContext, Children } from "react";
import { arrowStyle } from "../../styles/graphStyles";
import { ArcherElement } from "react-archer";
import { StackContext } from "../../contexts/stack";
import { isEmpty } from "lodash";
import { ELEMENTS_OFFSET_MAP } from "../../constants";
import { Web3Context } from "@dapperlabs/react-web3";

function WrapperStack(props) {
  const { connections, id, outputs, type } = props;
  const [targetRelation, setTargetRelation] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const {
    dispatchUi,
    setShowModal,
    uiStack,
    setLimitColumn,
    limitColumn,
    checkElement,
    graphIsLoaded,
  } = useContext(StackContext);
  const { web3 } = useContext(Web3Context);
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

  useEffect(() => {
    console.log("ELEMENTE!!! ->", id, outputs, type);

    const init = async () => {
      try {
        let status = await checkElement(web3, id);
        console.log(status);
        setIsReady(status === 'ready' ? true : status)
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  const handleSelect = () => {
    console.log("Wrapped click:", id);
    if (isSelected) {
      dispatchUi({ type: "UNSELECT_ELEMENT", id });
    } else {
      dispatchUi({ type: "SELECT_ELEMENT", id });
    }
    setIsSelected(!isSelected);
    setShowModal(!isSelected);
  };

  return (
    <ArcherElement id={id} relations={targetRelation}>
      {React.cloneElement(props.children, {
        ...props,
        selectAction: handleSelect,
        isSelected: isSelected,
        isReady: isReady,
        graphIsLoaded: graphIsLoaded,
      })}
    </ArcherElement>
  );
}

export default WrapperStack;
