import React, { useRef, useEffect, useContext } from "react";
import "./App.scss";
import InitStack from "./components/InitStack";
import OperationStack from "./components/OperationStack";
import { ArcherContainer, ArcherElement } from "react-archer";
import EmptyStack from "./components/EmptyStack";
import NewInitStack from "./components/NewInitStack";
import SplitterStack from "./components/SplitterStack";
import { columnStyle } from "./styles/graphStyles";
import AddressStack from "./components/AddressStack";
import Modal from "react-modal";
import { StackContext } from "./contexts/stack";

const arrowStyle = {
  strokeColor: "#ffdd57",
  strokeWidth: 2,
  strokeDasharray: 2,
  arrowLength: 4,
  arrowThickness: 0,
};

function App() {
  // Modal.setAppElement('#main')

  return (
    <section className="view">
      <div id="main" className="container ">
        <h1 className="title is-3 has-text-warning">compose.fi</h1>
        <h2 className="subtitle">Experiments 🧪 with DeFi</h2>
      </div>

      <MainOperation />
      <ModalAction />
    </section>
  );
}

export default App;

function MainOperation() {
  const WidthHeightBox = "2000px";

  const gridWrapper = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: WidthHeightBox,
    height: WidthHeightBox,
  };

  const ref = useRef();

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
        {/* LEVEL 0 */}

        <div style={columnStyle}>
          <InitStack id={"stack00-00"} asset="wbtc" target={"stack00-01"} />
          <InitStack id={"stack01-00"} asset="usdc" target={"stack01-01"} />
          <InitStack id={"stack02-00"} asset="eth" target={"stack03-03"} />
          <NewInitStack />
        </div>

        {/* LEVEL 1 */}

        <div style={columnStyle}>
          <OperationStack
            id={"stack00-01"}
            assetIn="wbtc"
            assetOut="eth"
            target={"stack03-03"}
          />
          <OperationStack
            id={"stack01-01"}
            assetIn="usdc"
            assetOut="eth"
            target={"stack03-03"}
          />
        </div>

        {/* LEVEL 2 */}

        <div style={columnStyle}>
          <EmptyStack />
          <EmptyStack />
          <SplitterStack
            id={"stack03-03"}
            asset="eth"
            target={["stack04-02", "stack04-03"]}
          />
        </div>

        {/* LEVEL 3 */}

        <div style={columnStyle}>
          <EmptyStack />
          <AddressStack
            id={"stack04-02"}
            address="0x7e88c8d56ba851ab12aa839eb908698e491f24a5"
          />
          <AddressStack
            id={"stack04-03"}
            address="0x2E80E8787f8EA20596CB1A2378f4334cFB8CCD2B"
          />
        </div>
      </div>
    </ArcherContainer>
  );
}

function ModalAction() {
  const { showModal, setShowModal, dispatchStack, stack } = useContext(
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
  console.log(showModal);

  const handleClose = () => {
    dispatchStack({ type: "CLEAR_STACK" });
    setShowModal(false);
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
              <div>Stack Selected:</div>
              <button
                onClick={() => setShowModal(false)}
                class="button is-primary is-small is-outlined"
              >
                Select another
              </button>
            </div>
            <div class="modal__tag tags are-large">
              {stack.map((st) => (
                <span className="tag is-primary ">{st.id}</span>
              ))}
            </div>
          </div>
          <div className="modal__content">Options:</div>

          <button className="button is-warning is-fullwidth is-rounded">
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
