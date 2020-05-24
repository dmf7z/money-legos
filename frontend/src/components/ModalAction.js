import React, { useEffect, useRef, useState, useContext } from "react";
import Modal from "react-modal";
import { StackContext } from "../contexts/stack";
import {
  ASSETS_COLORS,
  ASSETS_NAMES,
  NEW_INIT_ELEMENT,
} from "../constants/index";
import { SmallIcon } from "./modal/SmallIcon";
import { OperationsOption } from "./modal/OperationsOptions";
import { AssetsOptions } from "./modal/AssetsOptions";
import { SplittersOptions, SplittersOption } from "./modal/SplittersOption";
import { isElementComplete } from "../utils";
import { isEmpty } from "lodash";
import { AddressOption, OutputsOption } from "./modal/OutputsOption";
import { LoadedOptions } from "./modal/LoadedOption";
import { FlashOptions } from "./modal/FlashOptions";

export default function ModalAction() {
  const {
    showModal,
    setShowModal,
    dispatchGraph,
    dispatchUi,
    uiStack,
    graph,
    setShowAvailable,
    graphIsLoaded,
  } = useContext(StackContext);
  const [idsSelected, setIdsSelected] = useState([]);
  const [isInitStack, setIsInitStack] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [tab, setTab] = useState("operation");

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

  const getGraphElement = (id) => {
    if (id == "NewInitStack") {
      return NEW_INIT_ELEMENT;
    } else {
      return graph.getElementById(id);
    }
  };

  let checker = (arr) =>
    arr.every((v) => isElementComplete(getGraphElement(v)) == true);

  useEffect(() => {
    if (uiStack.includes("NewInitStack")) {
      setIsInitStack(true);
    }

    console.log(checker(uiStack));
    !isEmpty(uiStack) && setIsComplete(checker(uiStack));

    // !isEmpty(uiStack) &&
    //   setIsComplete(isElementComplete(graph.getElementById(uiStack)));
  }, [uiStack]);

  const closeModal = () => {
    // setShowAvailable(true)
    dispatchUi({ type: "CLEAR_SELECTED" });
    setShowModal(false);
    setIsInitStack(false);
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
              <div>
                {!isInitStack && !graphIsLoaded && (
                  <button
                    onClick={() => setShowModal(false)}
                    class="button is-primary is-small is-outlined"
                  >
                    + Add element
                  </button>
                )}
                <button
                  onClick={() => closeModal()}
                  class="button is-small modal__close"
                >
                  <span class="icon is-small">X</span>
                </button>
              </div>
            </div>
            <div class="modal__select">
              {uiStack &&
                uiStack.map((el) => <SmallElement key={el.id} id={el} />)}
            </div>
          </div>
          {/* init of tabs */}
          {!graphIsLoaded && (
            <>
              {!isInitStack && !isComplete && (
                <div class="tabs is-centered is-boxed modal__tab">
                  <ul>
                    <li
                      class={`${tab === "operation" && "is-active"}`}
                      onClick={() => setTab("operation")}
                    >
                      <a>
                        <span class="icon is-small">
                          <i class="fas fa-image" aria-hidden="true"></i>
                        </span>
                        <span>📟 Operations</span>
                      </a>
                    </li>
                    <li
                      class={`${tab === "splitter" && "is-active"}`}
                      onClick={() => setTab("splitter")}
                    >
                      <a>
                        <span class="icon is-small">
                          <i class="fas fa-music" aria-hidden="true"></i>
                        </span>
                        <span>⚖️ Splitter</span>
                      </a>
                    </li>
                    <li
                      class={`${tab === "address" && "is-active"}`}
                      onClick={() => setTab("address")}
                    >
                      <a>
                        <span class="icon is-small">
                          <i class="fas fa-film" aria-hidden="true"></i>
                        </span>
                        <span>📇 Outputs</span>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              {/* end of tabs */}
              {/* init of tabs for create */}

              {!isInitStack && !isComplete && (
                <div className="modal__content">
                  {tab === "operation" && !isComplete && (
                    <div>
                      <div className="modal__options">
                        <span class="tag is-info is-light is-small is-fullwidth">
                          Here you can choose an instrument to trade / swap
                          tokens!
                        </span>
                      </div>
                      <OperationsOption ids={uiStack} closeModal={closeModal} />
                    </div>
                  )}
                  {tab === "splitter" && (
                    <div>
                      <div className="modal__options">
                        <span class="tag is-info is-light is-small is-fullwidth">
                          Here you can choose one or many outputs to split in
                          other elements
                        </span>
                        <SplittersOption
                          ids={uiStack}
                          closeModal={closeModal}
                        />
                      </div>
                    </div>
                  )}
                  {tab === "address" && !isComplete && (
                    <div>
                      <div className="modal__options">
                        <span class="tag is-info is-light is-small is-fullwidth">
                          Here you can select an address as an output.
                        </span>
                        <OutputsOption ids={uiStack} closeModal={closeModal} />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {isInitStack && !isComplete && (
                <>
                  <div class="tabs is-centered is-boxed modal__tab">
                    <ul>
                      <li
                        class={`${tab === "operation" && "is-active"}`}
                        onClick={() => setTab("operation")}
                      >
                        <a>
                          <span class="icon is-small">
                            <i class="fas fa-image" aria-hidden="true"></i>
                          </span>
                          <span>📟 Assets</span>
                        </a>
                      </li>
                      <li
                        class={`${tab === "splitter" && "is-active"}`}
                        onClick={() => setTab("flashswap")}
                      >
                        <a>
                          <span class="icon is-small">
                            <i class="fas fa-music" aria-hidden="true"></i>
                          </span>
                          <span>⚡️ Flash Swap</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="modal__content">
                    {tab === "operation" && (
                      <div>
                        <div className="modal__options">
                          <span class="tag is-info is-light is-small is-fullwidth">
                            Please choose your asset to start the path
                          </span>
                        </div>

                        <AssetsOptions ids={uiStack} closeModal={closeModal} />
                      </div>
                    )}
                    {tab === "flashswap" && (
                      <div>
                        <div className="modal__options">
                          <span class="tag is-info is-light is-small is-fullwidth">
                            Please choose your asset to start the path
                          </span>
                        </div>

                        <FlashOptions ids={uiStack} closeModal={closeModal} />
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {/* end of tabs for create */}
          {graphIsLoaded && (
            <LoadedOptions ids={uiStack} closeModal={closeModal} />
          )}
        </div>
      </Modal>
    </div>
  );
}

const SmallElement = (props) => {
  const { id } = props;
  const { graph } = useContext(StackContext);

  let element =
    id === "NewInitStack" ? NEW_INIT_ELEMENT : graph.getElementById(id);

  return (
    <div key={id} className="modal__select--item">
      <SmallIcon {...element} selected={true} />
      <SmallDescription {...element} />
    </div>
  );
};

function SmallDescription(props) {
  console.log("small desc", props);

  switch (props.type) {
    case "NewInitStack":
      return `Choose Asset`;
    case "InputElement":
      return `Start with ${ASSETS_NAMES[props.outputs[0]]}`;
    case "OperationElement":
      return `${props.instrument}: ${ASSETS_NAMES[props.inputs[0]]} / ${
        ASSETS_NAMES[props.outputs[0]]
      }`;
    case "SplitterElement":
      return `${props.description}`;
    case "AddressElement":
      return `${props.description}`;
    case "FlashSwapOut":
      return `${props.description}`;

    case "FlashSwapIn":
      return `${props.description}`;
    default:
      return `${props.description}`;
  }
}
