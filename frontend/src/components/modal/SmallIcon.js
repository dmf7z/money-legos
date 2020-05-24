import React, { useEffect, useRef, useContext } from "react";
import { ASSETS_COLORS } from "../../constants";

export const SmallIcon = (props) => {
  // console.log("SmallIcon ", props);
  let size = props.selected ? "64px" : "30px";
  switch (props.type) {
    case "InputElement":
      // console.log(ASSETS_COLORS[props.outputs[0]]);
      return (
        <svg width={size} height={size} viewBox="0 0 64 63">
          <g
            id="Page-2"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Artboard"
              transform="translate(-55.000000, -58.000000)"
              stroke="#D7D8D8"
            >
              <g id="InputElement" transform="translate(55.000000, 58.000000)">
                <path
                  d="M0.5,31.5 L0.5,55 C0.5,59.1421356 3.85786438,62.5 8,62.5 L56,62.5 C60.1421356,62.5 63.5,59.1421356 63.5,55 L63.5,31.5 L0.5,31.5 Z"
                  fill={ASSETS_COLORS[props.outputs[0]]}
                ></path>
                <path
                  d="M0.5,31.5 L63.5,31.5 L63.5,8 C63.5,3.85786438 60.1421356,0.5 56,0.5 L8,0.5 C3.85786438,0.5 0.5,3.85786438 0.5,8 L0.5,31.5 Z"
                  fill="#FFFFFF"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      );
    case "FlashSwapIn":
      // console.log(ASSETS_COLORS[props.outputs[0]]);
      return (
        <svg width={size} height={size} viewBox="0 0 64 63">
          <g
            id="Page-2"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Artboard"
              transform="translate(-55.000000, -58.000000)"
              stroke="#D7D8D8"
            >
              <g id="InputElement" transform="translate(55.000000, 58.000000)">
                <path
                  d="M0.5,31.5 L0.5,55 C0.5,59.1421356 3.85786438,62.5 8,62.5 L56,62.5 C60.1421356,62.5 63.5,59.1421356 63.5,55 L63.5,31.5 L0.5,31.5 Z"
                  fill={ASSETS_COLORS[props.outputs[0]]}
                ></path>
                <path
                  d="M0.5,31.5 L63.5,31.5 L63.5,8 C63.5,3.85786438 60.1421356,0.5 56,0.5 L8,0.5 C3.85786438,0.5 0.5,3.85786438 0.5,8 L0.5,31.5 Z"
                  fill="#FFFFFF"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      );
    case "OperationElement":
      // console.log(ASSETS_COLORS[props.inputs[0]]);
      // console.log(props.inputs[0]);
      return (
        <svg width={size} height={size} viewBox="0 0 64 63">
          <g
            id="Page-2"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Artboard"
              transform="translate(-55.000000, -58.000000)"
              stroke="#D7D8D8"
            >
              <g id="InputElement" transform="translate(55.000000, 58.000000)">
                <path
                  d="M0.5,31.5 L0.5,55 C0.5,59.1421356 3.85786438,62.5 8,62.5 L56,62.5 C60.1421356,62.5 63.5,59.1421356 63.5,55 L63.5,31.5 L0.5,31.5 Z"
                  fill={ASSETS_COLORS[props.outputs[0]]}
                ></path>
                <path
                  d="M0.5,31.5 L63.5,31.5 L63.5,8 C63.5,3.85786438 60.1421356,0.5 56,0.5 L8,0.5 C3.85786438,0.5 0.5,3.85786438 0.5,8 L0.5,31.5 Z"
                  fill={ASSETS_COLORS[props.inputs[0]]}
                ></path>
              </g>
            </g>
          </g>
        </svg>
      );
    case "NewInitStack":
      return (
        <svg
          width="64px"
          height="64px"
          viewBox="0 0 64 64"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <rect
              id="path-1"
              x="149"
              y="58"
              width="64"
              height="64"
              rx="8"
            ></rect>
            <mask
              id="mask-2"
              maskContentUnits="userSpaceOnUse"
              maskUnits="objectBoundingBox"
              x="0"
              y="0"
              width="64"
              height="64"
              fill="white"
            >
              <use xlinkHref="#path-1"></use>
            </mask>
          </defs>
          <g
            id="Page-2"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
            strokeDasharray="2"
          >
            <g
              id="Artboard"
              transform="translate(-149.000000, -58.000000)"
              stroke="#979797"
              strokeWidth="2"
            >
              <use id="Rectangle" mask="url(#mask-2)" xlinkHref="#path-1"></use>
            </g>
          </g>
        </svg>
      );
    case "SplitterElement":
      // console.log(ASSETS_COLORS[props.inputs[0]]);
      // console.log(props.inputs[0]);
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 63"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Artboard"
              transform="translate(-220.000000, -367.000000)"
              stroke="#D7D8D8"
            >
              <g
                id="SplitterElement"
                transform="translate(220.000000, 367.000000)"
              >
                <path
                  d="M0.5,31.5 L0.5,55 C0.5,59.1421356 3.85786438,62.5 8,62.5 L56,62.5 C60.1421356,62.5 63.5,59.1421356 63.5,55 L63.5,31.5 L0.5,31.5 Z"
                  id="Rectangle"
                  fill="#ffffff"
                  fillRule="nonzero"
                ></path>
                <path
                  d="M0.503887893,31.5 L63.4961121,31.5 C63.2289794,14.3336123 49.2299963,0.5 32,0.5 C14.7700037,0.5 0.771020616,14.3336123 0.503887893,31.5 Z"
                  id="Rectangle"
                  fill={ASSETS_COLORS[props.inputs[0]]}
                ></path>
              </g>
            </g>
          </g>
        </svg>
      );
    case "AddressElement":
      // console.log(ASSETS_COLORS[props.inputs[0]]);
      // console.log(props.inputs[0]);
      return (
        <svg
          width={size}
          viewBox="0 0 64 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <rect
              id="Rectangle"
              stroke="#D7D8D8"
              fill="#FFFFFF"
              x="0.5"
              y="0.5"
              width="63"
              height="31"
              rx="5"
            ></rect>
          </g>
        </svg>
      );
    case "FlashSwapOut":
      // console.log(ASSETS_COLORS[props.inputs[0]]);
      // console.log(props.inputs[0]);
      return (
        <svg
          width={size}
          viewBox="0 0 64 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <rect
              id="Rectangle"
              stroke="#D7D8D8"
              fill="#FFFFFF"
              x="0.5"
              y="0.5"
              width="63"
              height="31"
              rx="5"
            ></rect>
          </g>
        </svg>
      );
  }
};
