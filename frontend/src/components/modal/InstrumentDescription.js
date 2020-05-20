import React, { useEffect, useRef, useContext } from "react";
import { ASSETS_COLORS } from "../../constants";

export const InstrumentDescription = (props) => {
  // console.log("Instrument ", props);
  switch (props.instrument) {
    case "Uniswap":
      return <span className="modal__op--title">Uniswap 🦄</span>;
    case "Compound":
      return (
        <span className="modal__op--title">
          Compound{" "}
          <img
            className="modal__op--img"
            src={require("../../assets/icons/compound.svg")}
          />
        </span>
      );
    case "0x":
      return (
        <span className="modal__op--title">
          0x{" "}
          <img
            className="modal__op--img"
            src={require("../../assets/icons/0x.svg")}
          />
        </span>
      );
      case "Curve":
        return (
          <span className="modal__op--title">
            Curve{" "}
            <img
              className="modal__op--img"
              src={require("../../assets/icons/curve2.svg")}
            />
          </span>
        );
    case "Oasis":
      return (
        <span className="modal__op--title">
          Oasis{" "}
          <img
            className="modal__op--img"
            src={require("../../assets/icons/oasis.ico")}
          />
        </span>
      );

    default:
      return <span>{props.instrument}</span>;
  }
};
