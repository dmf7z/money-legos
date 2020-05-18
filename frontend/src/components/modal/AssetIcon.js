import React, { useEffect, useRef, useContext } from "react";
import { ASSETS_COLORS } from "../../constants";

export const AssetIcon = (props) => {
  switch (props.asset) {
    case 'ETH':
      return <img className="modal__asset-icon" src={require('../../assets/icons/eth.svg')} />
    default:
      return <img className="modal__asset-icon" src={require(`../../assets/icons/${props.asset}.svg`)}></img>

  }
};
