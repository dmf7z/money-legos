import React from "react";
import IdenticonAddress from "../IdenticonAddress";
import { ASSETS_NAMES, ASSETS_COLORS } from "../../constants";
import { InstrumentDescription } from "../modal/InstrumentDescription";
import { adjustColor } from "../../utils";

const AddressStack = React.forwardRef((props, ref) => {
  const {
    id,
    outputs,
    inputs,
    isSelected,
    instrument,
    isReady,
    graphIsLoaded,
    type,
    executionData
  } = props;

  console.log(props);
  let address = props.executionData[0] ? props.executionData[0].data : "";
  const handleClickInit = () => {
    props.selectAction();
  };

  let asset = ASSETS_NAMES[outputs[0]];
  let amount = executionData[1].data;

  return (
    <div
      ref={ref}
      onClick={handleClickInit}
      className="stack__common stack--square box box--square"
    >
      {graphIsLoaded && (
        <div className="stack__icon--address">{isReady ? "✅" : "❌"}</div>
      )}
      {type == "FlashSwapOut" && (
        <div className=" stack stack-color__content">
          <div className="stack-color__address">
          <InstrumentDescription instrument={instrument} />
            <div>FlashSwapOut</div>
            <IdenticonAddress address={address} />
          </div>
        </div>
      )}
      {type == "FlashSwapIn" && (
               <div
               className={`stack__common stack stack--square box box--square ${
                 isSelected && "selection__box"
               }`}
             >
               <div className="stack-color__content">
          <InstrumentDescription instrument={instrument} />

                 <div className="stack-color__name">Borrow {graphIsLoaded && amount} {asset}</div>
               </div>
               <div className={`stack-color stack-color--${asset}`}>
                 <div
                   style={{
                     backgroundColor: adjustColor(ASSETS_COLORS[outputs[0]], 30),
                   }}
                   className="stack-color__square stack-color__lighten stack-color__lighten--out"
                 >
                   {asset}
                 </div>
                 <div
                   style={{
                     backgroundColor: adjustColor(ASSETS_COLORS[outputs[0]], 10),
                   }}
                   className="stack-color__square stack-color__darken stack-color__darken--out"
                 >
                   <img src={require(`../../assets/icons/${asset}.svg`)}></img>
                 </div>
               </div>
             </div>
      )}
    </div>
  );
});

export default AddressStack;
