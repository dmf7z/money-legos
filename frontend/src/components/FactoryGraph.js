import React, { useRef, useEffect, useState, useContext } from "react";
import { ArcherContainer } from "react-archer";
import { StackContext } from "../contexts/stack";

import { columnStyle, gridWrapper } from "../styles/graphStyles";
import RenderElement from "./elements/RenderElement";
import { isEmpty } from "lodash";
import { EMPTY_ELEMENT } from "../constants";

const MAP_INDEX = [4, 4];

function FactoryGraph(props) {
  const { graph, uiStack } = useContext(StackContext);

  const [isLoading, setIsLoading] = useState(true);
  const [graphMap, setgraphMap] = useState([{}]);

  const ref = useRef();

  useEffect(() => {
    // let useMap = isEmpty(graph) ? props.graph : graph;
    console.log('getting new Graph!')
    console.log(graph)

    let newMap = GenerateMap(graph);

    setgraphMap(newMap);
    setIsLoading(false);
    // 

    
  }, [graph, uiStack]);

  const tryAs = () =>{
    console.log('rrrr')
    console.log(ref)
    GenerateMap(graph)
    ref.current.refreshScreen()
  }

  return (
    <>
    <div><button onClick={tryAs }>RRRR</button></div>
    <ArcherContainer
      ref={ref}
      className={"test3"}
      svgContainerStyle={{ zIndex: 0 }}
      strokeColor="red"
    >
      {isLoading && <div>LOADING...</div>}

      <div  style={gridWrapper}>
      

        {!isLoading &&
          graphMap.map((line) => {
            return (
              <div style={columnStyle}>
                {line.map((element) => <RenderElement {...element} /> )}
              </div>
            );
          })}
      </div>
    </ArcherContainer>
    </>
  );
}

export default FactoryGraph;

function GenerateMap(graph) {
  console.log("starting map", graph);
  if (isEmpty(graph.elements)){ return []}
  let elementsMap = [];
  for (let i = 0; i < MAP_INDEX[1]; i++) {
    let line = [];
    for (let m = 0; m < MAP_INDEX[0]; m++) {
      let graphElement = graph.elements.filter(
        (el) => el.index[0] == m && el.index[1] == i
      );
      let emptyWithPos = EMPTY_ELEMENT;
      emptyWithPos.index = [m, i];
      let squareElement =
        graphElement.length > 0 ? graphElement[0] : emptyWithPos;

      line[m] = squareElement;
      // console.log(`element [${m}][${i}] = ${squareElement}`);
    }
    elementsMap[i] = line;
    console.log("LINE! ", i);
    console.log(line);
  }

  // console.log("FINAL: ", elementsMap);

  return elementsMap;
}
