

import React, { useEffect, useRef } from "react";

import Jazzicon from "jazzicon";
import {shortenAddress} from '../utils'

export default function IdenticonAddress(props) {
  const ref = useRef();

  useEffect(() => {
    if (props.address) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(props.address.slice(2, 10), 16)));
    }
  }, [props.address]);

  return (
    <div className="identicon__box" >
      <div className="identicon__img" ref={ref}> </div>
      <div className="identicon__address" > {props.address ? (props.long ? props.address : shortenAddress(props.address)) : "No Wallet selected"} </div>
    </div>
  );
}
