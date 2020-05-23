import React, { useEffect, useState, useContext } from "react";
import { slugify } from "../utils";
import { useForm } from "react-hook-form";

export default function ElementForm(props) {
  const { element, limitColumn, parents } = props;
  const onSubmit = (data) => {
    let addElement = {
      parents: parents,
      element: element,
      limit: limitColumn,
      data: data,
    };

    console.log(data);
    props.action(addElement);
  };
  const { register, handleSubmit, watch, errors } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {element.executionData
          .filter((input) => input.type === "input")
          .map((input) => {
            let name = slugify(input.title);
            return (
              <div class="field">
                <label class="label">{input.title}</label>
                <div class="control">
                  <input
                    class="input is-info"
                    type="text"
                    name={name}
                    placeholder={input.default}
                    value={input.required ? input.default : ""}
                    ref={register({ required: input.required })}
                  />
                </div>
                <p class="help">{input.description}</p>
                {errors[name] && <span>This field is required</span>}
              </div>
            );
          })}
      </div>
      <div>
        <button
          type="submit"
          // onClick={() => handleAction(element)}
          className="button is-warning is-fullwidth is-rounded"
        >
          OK!
        </button>
      </div>
    </form>
  );
}
