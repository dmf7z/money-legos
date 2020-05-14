import React, { useRef, useEffect } from "react";
import { ArcherContainer } from "react-archer";
import { columnStyle } from "../styles/graphStyles";
import selectElement from "./elements";

function FactoryGraph(props) {
  const WidthHeightBox = "2000px";

  const gridWrapper = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: WidthHeightBox,
    height: WidthHeightBox,
  };

  const ref = useRef();
  console.log(props);

  useEffect(() => {
    console.log(ref.current.scrollWidth);
  }, []);

  return (
    <ArcherContainer
      className={"test3"}
      svgContainerStyle={{ zIndex: 0 }}
      strokeColor="red"
    >
      <div ref={ref} style={gridWrapper}>
        {props.graph.map((level) => {
          return (
            <div style={columnStyle}>
              {level.elements.map((element) => selectElement(element))}
            </div>
          );
        })}
      </div>
    </ArcherContainer>
  );
}


export default FactoryGraph;
