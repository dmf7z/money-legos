import React, { useRef, useEffect, useState, useContext } from "react";
import { ArcherContainer } from "react-archer";
import { StackContext } from "../contexts/stack";

import { columnStyle, gridWrapper } from "../styles/graphStyles";
import selectElement from "./elements";
import { isEmpty } from "lodash";
import { EMPTY_ELEMENT } from "../constants";

const MAP_INDEX = [8, 8];

function FactoryGraphV2(props) {
  const { dispatchGraph, graph } = useContext(StackContext);

  const [isLoading, setIsLoading] = useState(true);
  const [graphMap, setgraphMap] = useState([{}]);

  const ref = useRef();

  useEffect(() => {
    let useMap = isEmpty(graph) ? props.graph : graph;
    let newMap = GenerateMap(useMap);

    setgraphMap(newMap);
    dispatchGraph({ type: "ADD_STACK", useMap });
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
                {line.map((element) => selectElement(element))}
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
      let emptyWithPos = EMPTY_ELEMENT;
      emptyWithPos.index = [m, i];
      let squareElement =
        graphElement.length > 0 ? graphElement[0] : emptyWithPos;

      line[m] = squareElement;
      console.log(`element [${m}][${i}] = ${squareElement}`);
    }
    elementsMap[i] = line;
    console.log("LINE! ", i);
    console.log(line);
  }

  // console.log("FINAL: ", elementsMap);

  return elementsMap;
}
