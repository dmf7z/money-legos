import React, { useEffect, useRef, useContext } from "react";
import Modal from "react-modal";
import { StackContext } from "../contexts/stack";
import { ASSETS_COLORS, ASSETS_NAMES } from "../constants/index";
import { SmallIcon } from "./modal/SmallIcon";

export default function ModalAction() {
  const {
    showModal,
    setShowModal,
    dispatchGraph,
    dispatchUi,
    uiStack,
    graph,
    setShowAvailable,
  } = useContext(StackContext);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "12px",
      padding: "0px",
    },
  };

  console.log("HERE!!! ", uiStack);

  const handleClose = () => {
    dispatchUi({ type: "CLEAR_SELECTED" });

    setShowModal(false);
  };

  const handleAction = () => {
    // setShowAvailable(true)
    // setShowModal(false);
    dispatchGraph({ type: "ADD_GRAPH" });
  };

  return (
    <div>
      <Modal
        isOpen={showModal}
        contentLabel="onRequestClose Example"
        style={customStyles}
        overlayClassName="modal__overlay"
        //  onRequestClose={}
      >
        <div className="modal__box">
          <div className="modal__selected">
            <div className="modal__selected--options">
              <div className="modal__title">Stack Selected:</div>
              <button
                onClick={() => setShowModal(false)}
                class="button is-primary is-small is-outlined"
              >
                + Add element
              </button>
            </div>
            <div class="modal__select">
              {uiStack && uiStack.map((el) => <SmallElement id={el} />)}
            </div>
          </div>
          <div class="tabs is-centered is-boxed">
            <ul>
              <li class="is-active">
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-image" aria-hidden="true"></i>
                  </span>
                  <span>📟 Operations</span>
                </a>
              </li>
              <li>
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-music" aria-hidden="true"></i>
                  </span>
                  <span>⚡️ Splitter</span>
                </a>
              </li>
              <li>
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-film" aria-hidden="true"></i>
                  </span>
                  <span>📇 Address</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="modal__content">
            <div>
              <span class="tag is-info is-light is-small">
                ! You choose an instrument + output
              </span>

              {/* definir inputs! en un UseEffects */}
              <ActionOption action={() => handleAction()} />
              <ActionOption action={() => handleAction()} />
              <ActionOption action={() => handleAction()} />
              <ActionOption action={() => handleAction()} />
              <ActionOption action={() => handleAction()} />
            </div>
          </div>

          <button
            onClick={handleClose}
            className="button is-warning is-fullwidth is-rounded"
          >
            OK!
          </button>
          <div
            className="has-text-centered is-fullwidth has-text-info"
            onClick={handleClose}
          >
            Cancel
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ActionOption(props) {
  // let options = stack.map((st)=>{
  //   console.log(st.type, st.output)
  // if(st.type == 'InputElement' && st.output == 'wbtc'){
  return (
    <div
      onClick={props.action}
      className="modal__op-btn button is-fullwidth is-medium"
    >
      <SmallIcon
        inputs={["0x6B175474E89094C44Da98b954EedeAC495271d0F"]}
        outputs={["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"]}
        type="OperationElement"
      />

      <div className="modal__op-desc"> Uniswap 🦄 WBTC / ETH</div>
    </div>
  );

  // }

  // })
  // return options
}

const SmallElement = (props) => {
  const { id } = props;
  const { graph } = useContext(StackContext);

  let element = graph.getElementById(id);

  return (
    <div className="modal__select--item">
      <SmallIcon {...element} selected={true} />
      <SmallDescription {...element} />
    </div>
  );
};

function SmallDescription(props) {
  console.log("small desc", props);

  switch (props.type) {
    case "InputElement":
      return `Start with ${ASSETS_NAMES[props.outputs[0]]}`;
    case "OperationElement":
      return `${props.instrument}: ${ASSETS_NAMES[props.inputs[0]]} / ${
        ASSETS_NAMES[props.outputs[0]]
      }`;
  }
}
