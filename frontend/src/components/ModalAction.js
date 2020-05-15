import React, { useEffect, useRef, useContext } from "react";
import Modal from "react-modal";
import { StackContext } from "../contexts/stack";


export default function ModalAction() {
  const { showModal, setShowModal, dispatchStack, stack, setShowAvailable } = useContext(
    StackContext
  );

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "12px",
    },
  };

  console.log(stack);

  const handleClose = () => {
    dispatchStack({ type: "CLEAR_STACK" });
    setShowModal(false);
  };

  const handleAction= () => {
    setShowAvailable(true)
    setShowModal(false);
  }

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
              <div>Stack Selected:</div>
              <button
                onClick={() => setShowModal(false)}
                class="button is-primary is-small is-outlined"
              >
                + Add element
              </button>
            </div>
            <div class="modal__tag tags are-large">
              {stack.map((el) => (
                <span className="tag is-primary ">{el.id}</span>
              ))}
            </div>
          </div>
          <div className="modal__content">Options:
          <div>
            {actionOption(stack, () => handleAction())}
          </div>
          
          </div>

          <button onClick={handleClose} className="button is-warning is-fullwidth is-rounded">
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

function actionOption(stack, action){

  let options = stack.map((st)=>{
    console.log(st.type, st.output)
    if(st.type == 'InputElement' && st.output == 'wbtc'){
      return <button onClick={() => action()} >Operation WTC/ ETH</button>
    }
    
  })
  return options
}

