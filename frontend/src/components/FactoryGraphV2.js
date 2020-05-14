import React, { useRef, useEffect, useState, useContext } from "react";
import { ArcherContainer } from "react-archer";
import { StackContext } from "../contexts/stack";

import { columnStyle } from "../styles/graphStyles";
import selectElement from "./elements";
import { isEmpty } from "lodash";

const MAP_INDEX = [8, 8];



const EMPTY_ELEMENT = {
  id: "emptyId",
  type: "EmptyElement",
  address: "",
  addreinput: "",
  output: "",
  connections: [],
  index: [],
};

function FactoryGraphV2(props) {
  const { dispatchGraph, graph } = useContext(StackContext);

  const WidthHeightBox = "2000px";

  const gridWrapper = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: WidthHeightBox,
    height: WidthHeightBox,
  };
  const [isLoading, setIsLoading] = useState(true);
  const [graphMap, setgraphMap] = useState([{}]);

  const ref = useRef();
  // console.log(props);

  useEffect(() => {
    let useMap = isEmpty(graph) ? props.graph : graph
    let newMap = GenerateMap(useMap);
    console.log("XOXOX", useMap);
    setgraphMap(newMap);
    dispatchGraph({ type: "ADD_STACK",  useMap });
    setIsLoading(false);

  }, []);

  return (
    <ArcherContainer
      className={"test3"}
      svgContainerStyle={{ zIndex: 0 }}
      strokeColor="red"
    >
      {isLoading && <div>LOADING...</div>}

      <div ref={ref} style={gridWrapper}>
        {!isLoading &&
          graphMap.map((line) => {
            return (
              <div style={columnStyle}>
                {line.map((element) => selectElement(element,))}
              </div>
            );
          })}
      </div>
    </ArcherContainer>
  );
}

export default FactoryGraphV2;

function GenerateMap(graph) {



  console.log("starting map", graph);
  let elementsMap = [];
  for (let i = 0; i < MAP_INDEX[1]; i++) {
    let line = [];
    for (let m = 0; m < MAP_INDEX[0]; m++) {
      let graphElement = graph.filter(
        (el) => el.index[0] == m && el.index[1] == i
      );
      let emptyWithPos = EMPTY_ELEMENT
      emptyWithPos.index=[m,i]
      let squareElement =
        graphElement.length > 0 ? graphElement[0] : emptyWithPos;

      line[m] = squareElement;
      console.log(`element [${m}][${i}] = ${squareElement}`);
    }
    elementsMap[i] = line;
    console.log("LINE! ", i);
    console.log(line);

    // const [a, b, c] = lines[i];
    // if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //   return squares[a];
    // }
  }

  // console.log("FINAL: ", elementsMap);

  return elementsMap;
}
