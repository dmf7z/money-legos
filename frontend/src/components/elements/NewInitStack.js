import React, { useContext, useEffect } from "react";
import { StackContext } from "../../contexts/stack";

const NewInitStack = React.forwardRef((props, ref) => {
  const { setLimitColumn } = useContext(StackContext);

  useEffect(() => {
    setLimitColumn(props.index[0])

    }, []);

  const handleClickInit = () => {
    props.selectAction()

  }

  return (
    <div ref={ref} onClick={handleClickInit} className="stack__common stack--new stack--square box box--square">
      START WITH NEW ASSET
    </div>
  );
})

export default NewInitStack;
