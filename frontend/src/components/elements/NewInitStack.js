import React, { useContext } from "react";
import { StackContext } from "../../contexts/stack";

const NewInitStack = React.forwardRef((props, ref) => {
  const { setLimitColumn } = useContext(StackContext);

  const handleClickInit = () => {
    props.selectAction()
    setLimitColumn(props.index[0])

  }

  return (
    <div ref={ref} onClick={handleClickInit} className="stack--new stack--square box box--square">
      START WITH NEW ASSET
    </div>
  );
})

export default NewInitStack;
