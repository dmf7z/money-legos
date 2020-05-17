import * as factory from "library";

export const graphReducer = (state, action) => {
  console.log("graphReducer action ", action);
  let element 
  let parent
  //   console.log("1 state ", state);
  switch (action.type) {
    case "ADD_STACK":
      //   console.log("Stack selected ", action.id);
      //   console.log("2 state ", state);
      return state;

    case "ADD_OPERATION":
      console.log('ADD_OPERATION MY FRIEND', action)
      parent = state.getElementById(action.addElement.parent[0]);
      console.log('PARENT MY FRIEND', action.addElement.parent[0])

      element = factory.getElements()[action.addElement.element.key];
      console.log('element MY FRIEND', element)
      console.log(1,state)

      //Add element to graph
      state.connectElements([[parent.id, 0]], element, 0, parent.index[0], parent.index[1] + 1);
      console.log(2,state)
      return state

    case "ADD_GRAPH":
      element = factory.getElements().INPUT_DAI;
      state.addElement(element, 0, 0);

      console.log("2 state ", state);
      // return state[action.element.pos[1]][action.element.pos[0]] = action.element
      return state;

    case "CLEAR_STACK":
      return [];
    case "LOG_STACK":
      console.log(state.elements);
      return state;
    //   if (stack.id === action.id) {
    //     return { ...stack, complete: true };
    //   } else {
    //     return stack;
    //   }

    default:
      throw new Error();
  }
};
