export const stackReducer = (state, action) => {
  console.log("action ", action.type);
//   console.log("1 state ", state);
  switch (action.type) {
    case "SELECT_STACK":
    //   console.log("Stack selected ", action.id);
    //   console.log("2 state ", state);
      return state.concat({
        id: action.id,
      });
    case "UNSELECT_STACK":
    //   console.log("Stack selected ", action.id);
    //   console.log("2 state ", state);

      let filter = state.filter((obj)=>obj.id!=action.id);
      return filter

      case "CLEAR_STACK":
        return []
    //   if (stack.id === action.id) {
    //     return { ...stack, complete: true };
    //   } else {
    //     return stack;
    //   }

    default:
      throw new Error();
  }
};
