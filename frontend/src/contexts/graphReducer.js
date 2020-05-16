import * as factory from 'library'


export const graphReducer = (state, action) => {
  console.log("action ", action);
//   console.log("1 state ", state);
  switch (action.type) {
    case "ADD_STACK":
    //   console.log("Stack selected ", action.id);
    //   console.log("2 state ", state);
      return state

    case "ADD_OPERATION":
      element = factory.getElements().OP_UNISWAP_WBTC_TO_ETH;
      //Add element to graph
     state.connectElements([[action.uuid, 0]], element, 0, 0, 1);
  
    return state

      case "ADD_GRAPH":
        let element = factory.getElements().INPUT_DAI;
        state.addElement(element, 0, 0);

          console.log("2 state ", state);
          // return state[action.element.pos[1]][action.element.pos[0]] = action.element
          return state

      case "CLEAR_STACK":
        return []
      case "LOG_STACK":
        console.log(state.elements)
        return state
    //   if (stack.id === action.id) {
    //     return { ...stack, complete: true };
    //   } else {
    //     return stack;
    //   }

    default:
      throw new Error();
  }
};
