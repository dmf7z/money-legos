import React, { useEffect, useState, useContext } from "react";
import { slugify } from "../utils";
import { useForm } from "react-hook-form";
import * as factory from "library";
import { Web3Context } from "@dapperlabs/react-web3";

export default function ElementForm(props) {
  const { element, limitColumn, parents, graphIsLoaded } = props;
  const [zeroxBestOrder, setZeroxBestOrder] = useState();
  const [oasisBestOrder, setOasisBestOrder] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { web3 } = useContext(
    Web3Context
  );
  const onSubmit = (data) => {
    let addElement = {
      parents: parents,
      selectedElement: element,
      limit: limitColumn,
      data: data,
    };

    console.log("submitting data", data);
    props.action(addElement);
  };
  const { register, handleSubmit, watch, errors } = useForm();
  console.log(element);


  const checkOrder0x = async (e) => {
    console.log("checking 0x", e);
    setIsLoading(true)

    const order0x = await factory.helper.get0xOrder(
      element.inputs[0],
      element.outputs[0]
    );
    console.log("checking 0x result ", order0x);
    setZeroxBestOrder(order0x);
    setIsLoading(false)
  };

  const checkOrderOasis = async (e) => {
    console.log("checking Oasis", e);

  
  const orderOasis = await factory.helper.getOasisOrder(web3, element.inputs[0],  element.outputs[0]);

    console.log("checking 0x result ", orderOasis);
    setOasisBestOrder(orderOasis);
  };
  let info = [];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {element &&
          element.executionData &&
          element.instrument !== "0x" &&
          element.instrument !== "Oasis" &&
          element.executionData
            // .filter((input) => input.type === "input")
            .map((input, index) => {
              if (input.type === "input") {
                let name = slugify(input.title);
                let isRequired = graphIsLoaded
                  ? { required: input.required }
                  : {};
                // console.log("input!", name, index, isRequired, graphIsLoaded);

                return (
                  <div class="field">
                    <label class="label">{input.title}</label>
                    <div class="control">
                      <input
                        class="input is-info "
                        type="text"
                        name={index}
                        placeholder={input.data ? input.data : input.default}
                        // value={input.required ? input.default : ""}
                        ref={register(isRequired)}
                      />
                    </div>
                    <p class="help">{input.description}</p>
                    {errors[name] && <span>This field is required</span>}
                  </div>
                );
              }
            })}
        {element && element.instrument == "0x" && element.executionData && (
          <>
            <div
              onClick={(e) => checkOrder0x(e)}
              class={`button is-primary is-small is-outlined ${isLoading && 'is-loading'}`}
            >
              Check *best* 0x order
            </div>

            <div class="field">
              <label class="label">{element.executionData[0].title}</label>
              
              <div class="control">
                <textarea
                  class="textarea is-info is-small"
                  type="text"
                  name={0}
                  placeholder={
                    element.executionData[0].data
                      ? element.executionData[0].data
                      : element.executionData[0].default
                  }
                  value={JSON.stringify(zeroxBestOrder)}
                  ref={register(graphIsLoaded && { required: true })}
                />
              </div>
              <p class="help">{element.description}</p>
              {errors[0] && <span>This field is required</span>}
            </div>
          </>
        )}
        {element && element.instrument == "Oasis" && element.executionData && (
          <>
            <div
              onClick={(e) => checkOrderOasis(e)}
              class="button is-primary is-small is-outlined"
            >
              Check *best* Oasis order
            </div>

            <div class="field">
              <label class="label">{element.executionData[0].title}</label>
              
              <div class="control">
                <textarea
                  class="textarea is-info is-small"
                  type="text"
                  name={0}
                  placeholder={
                    element.executionData[0].data
                      ? element.executionData[0].data
                      : element.executionData[0].default
                  }
                  value={JSON.stringify(oasisBestOrder)}
                  ref={register(graphIsLoaded && { required: true })}
                />
              </div>
              <p class="help">{element.description}</p>
              {errors[0] && <span>This field is required</span>}
            </div>
          </>
        )}
      </div>
      <div>
        <button
          type="submit"
          // onClick={() => handleAction(element)}
          className="button is-warning is-fullwidth is-rounded modal__ok-btn"
        >
          OK!
        </button>
      </div>
    </form>
  );
}
