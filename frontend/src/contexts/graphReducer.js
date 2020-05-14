export const graphReducer = (state, action) => {
  console.log("action ", action);
//   console.log("1 state ", state);
  switch (action.type) {
    case "ADD_STACK":
    //   console.log("Stack selected ", action.id);
    //   console.log("2 state ", state);
      return state.concat(
        action.newMap
      );

      case "CHANGE_STACK":
          console.log("Stack selected ", action.element);

        //   console.log("2 state ", state);
          // return state[action.element.pos[1]][action.element.pos[0]] = action.element
          return state.concat(
            action.element
          );

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
