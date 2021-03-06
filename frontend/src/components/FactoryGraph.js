import React, { useRef, useEffect, useState, useContext } from "react";
import { ArcherContainer } from "react-archer";
import { StackContext } from "../contexts/stack";

import { columnStyle, gridWrapper } from "../styles/graphStyles";
import RenderElement from "./elements/RenderElement";
import { isEmpty } from "lodash";
import { EMPTY_ELEMENT, NEW_INIT_ELEMENT } from "../constants";

const MAP_INDEX = [12, 12];

function FactoryGraph(props) {
  const { graph, uiStack, limitColumn, graphIsLoaded } = useContext(StackContext);

  const [isLoading, setIsLoading] = useState(true);
  const [graphMap, setgraphMap] = useState([{}]);

  const ref = useRef();

  useEffect(() => {
    // let useMap = props.graph ? props.graph : graph;
    // console.log("getting new Graph!");
    // console.log(graph);
    console.log(props)

    let newMap = GenerateMap(graph , limitColumn, graphIsLoaded);

    setgraphMap(newMap);
    setIsLoading(false);
    //
  }, [graph, uiStack]);

  return (
    <ArcherContainer
      ref={ref}
      className={"test3"}
      svgContainerStyle={{ zIndex: 0 }}
      strokeColor="red"
    >
      {isLoading && <div>LOADING...</div>}

      <div style={gridWrapper}>
        {!isLoading &&
          graphMap.map((line) => {
            return (
              <div style={columnStyle}>
                {line.map((element) => (
                  <RenderElement {...element} />
                ))}
              </div>
            );
          })}
      </div>
    </ArcherContainer>
  );
}

export default FactoryGraph;

function GenerateMap(graph, limitColumn, graphIsLoaded) {
  let limitCol = limitColumn
  let emptyWithPos 

  console.log("starting map", graph);
  if (isEmpty(graph.elements)) {
    emptyWithPos = NEW_INIT_ELEMENT;
    emptyWithPos.index = [0, 0];
    let initMap =[[emptyWithPos]]

    return initMap;
  }
  let elementsMap = [];
  let firstEmptyElement = true
   emptyWithPos = EMPTY_ELEMENT;
  
  for (let i = 0; i < MAP_INDEX[1]; i++) {
    let line = [];
    for (let m = 0; m < MAP_INDEX[0]; m++) {
      let graphElement = graph.elements.filter(
        (el) => el.index[0] == m && el.index[1] == i
      );
      emptyWithPos.index = [m, i];
      // Check with is the first empty element, 
      // to add NewInit element (future InputElement)
      if (  firstEmptyElement && graphElement.length === 0 && !graphIsLoaded ){
        firstEmptyElement = false
        emptyWithPos = NEW_INIT_ELEMENT;
        emptyWithPos.index = [m, i];
        // console.log('Setting Init at: ', [m, i])
        limitCol = m
      }
      let squareElement =
        graphElement.length > 0 ? graphElement[0] : emptyWithPos;
        // console.log(`element [${m}][${i}] = ${squareElement.type} ${squareElement.key} `);

      line[m] = squareElement;
   emptyWithPos = EMPTY_ELEMENT;

      // if(graphElement.length > 0 && m >= limitCol && i > 0){
      // console.log(`IF element [${m}][${i}] = ${squareElement} ES MAYOR o igual que el init`);
      // console.log(elementsMap[0][m])
      // // if(elementsMap[0][m].type ){

      // // }
      // // emptyWithPos.index = [m, 0];
      // // elementsMap[0][m]= emptyWithPos
      // console.log(emptyWithPos)
      // console.log(elementsMap[0][m])

      // emptyWithPos = NEW_INIT_ELEMENT;
      // emptyWithPos.index = [m+1, 0];
      // elementsMap[0][m+1]= emptyWithPos
      // limitCol = m+1

      // }
    }
    elementsMap[i] = line;
    // console.log("LINE! ", i);
    // console.log(line);
  }

  // console.log("FINAL: ", elementsMap);

  return elementsMap;
}
