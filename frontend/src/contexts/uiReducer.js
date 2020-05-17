export const uiReducer = (state, action) => {
  console.log("uiReducer action ", action);
  console.log("uiReducer state ", state);
  //   console.log("1 state ", state);
  switch (action.type) {
    case "SELECT_ELEMENT":
      console.log("element selected ", action.id);
      //   console.log("2 state ", state);
      return state.concat(action.id);
    case "UNSELECT_ELEMENT":
      console.log("Element UNselected ", action.selected);
      //   console.log("2 state ", state);

      let filter = state.filter((obj) => obj != action.element.id);
      return filter;

    case "CLEAR_SELECTED":
      return [];
    //   if (stack.id === action.id) {
    //     return { ...stack, complete: true };
    //   } else {
    //     return stack;
    //   }

    default:
      throw new Error();
  }
};
