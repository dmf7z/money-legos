import React, { useEffect, useRef, useState, useContext } from "react";
import Modal from "react-modal";
import { StackContext } from "../contexts/stack";
import { ASSETS_COLORS, ASSETS_NAMES, NEW_INIT_ELEMENT } from "../constants/index";
import { SmallIcon } from "./modal/SmallIcon";
import { OperationsOption } from "./modal/OperationsOptions";
import { AssetsOptions } from "./modal/AssetsOptions";

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
  const [idsSelected, setIdsSelected] = useState([]);
  const [isInitStack, setIsInitStack] = useState(false);
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

  // console.log("HERE!!! ", uiStack);

    useEffect(() => {
    if(uiStack.includes('NewInitStack')){
      setIsInitStack(true)
    }

  }, [uiStack]);

  const closeModal = () => {
    // setShowAvailable(true)
    dispatchUi({ type: "CLEAR_SELECTED" });
    setShowModal(false);
    setIsInitStack(false)
    // dispatchGraph({ type: "ADD_GRAPH" });
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
                { ! isInitStack && <button
                  onClick={() => setShowModal(false)}
                  class="button is-primary is-small is-outlined"
                >
                  + Add element
                </button>}
                <button
                  onClick={() => closeModal()}
                  class="button is-small modal__close"
                >
                  <span class="icon is-small">X</span>
                </button>
              </div>
            </div>
            <div class="modal__select">
              {uiStack && uiStack.map((el) => <SmallElement id={el} />)}
            </div>
          </div>
          { !isInitStack && <div class="tabs is-centered is-boxed">
            <ul>
              <li class={`${tab === 'operation' && 'is-active'}`} onClick={() => setTab('operation')}>
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-image" aria-hidden="true"></i>
                  </span>
                  <span>📟 Operations</span>
                </a>
              </li>
              <li class={`${tab === 'splitter' && 'is-active'}`} onClick={() => setTab('splitter')}>
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-music" aria-hidden="true"></i>
                  </span>
                  <span>⚡️ Splitter</span>
                </a>
              </li>
              <li class={`${tab === 'address' && 'is-active'}`} onClick={() => setTab('address')}>
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-film" aria-hidden="true"></i>
                  </span>
                  <span>📇 Address</span>
                </a>
              </li>
            </ul>
          </div>}
          { !isInitStack && 

          <div className="modal__content">
          {tab === 'operation' && <div>
              <div className="modal__options">
                <span class="tag is-info is-light is-small is-fullwidth">
                  Here you can choose an instrument to trade / swap tokens!
                </span>
              </div>
              <OperationsOption ids={uiStack} closeModal={closeModal} />
            </div>}
            {tab === 'splitter' && <div>
              <div className="modal__options">
                <span class="tag is-info is-light is-small is-fullwidth">
                  Here you can choose one or many outputs to split in other elements
                </span>
              </div>
            </div>}
            {tab === 'address' && <div>
              <div className="modal__options">
                <span class="tag is-info is-light is-small is-fullwidth">
                  Here you can select an address as an output.
                </span>
              </div>
            </div>}
          </div>
          }
           { isInitStack &&  <div className="modal__content">
          <div>
              <div className="modal__options">
                <span class="tag is-info is-light is-small is-fullwidth">
                  Please choose your asset to start the path
                </span>
              </div>
              <AssetsOptions ids={uiStack} closeModal={closeModal} />
            </div>
        
           
          </div>}
     
        </div>
      </Modal>
    </div>
  );
}

const SmallElement = (props) => {
  const { id } = props;
  const { graph } = useContext(StackContext);

  let element = id === 'NewInitStack' ? NEW_INIT_ELEMENT : graph.getElementById(id);

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
    case "NewInitStack":
      return `Choose Asset`;
    case "InputElement":
      return `Start with ${ASSETS_NAMES[props.outputs[0]]}`;
    case "OperationElement":
      return `${props.instrument}: ${ASSETS_NAMES[props.inputs[0]]} / ${
        ASSETS_NAMES[props.outputs[0]]
      }`;
  }
}
