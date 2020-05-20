import * as factory from "library";

export const graphReducer = (state, action) => {
  console.log("graphReducer action ", action);
  let element;
  let parent;
  //   console.log("1 state ", state);
  switch (action.type) {
    case "ADD_STACK":
      //   console.log("Stack selected ", action.id);
      //   console.log("2 state ", state);
      return state;

    case "ADD_INPUT":
      // console.log("ADD_INPUT MY FRIEND", action);
      // console.log('PARENT MY FRIEND', action.addElement.parent[0])

      element = factory.getElements()[`INPUT_${action.addElement.asset}`];
      // console.log("element MY FRIEND", element);
      console.log(1, state);

      //Add element to graph
      // state.addElement(element, action.addElement.limit, 0);
      console.log(2, state);
      return state;

    case "ADD_OPERATION":
      // console.log('ADD_OPERATION MY FRIEND', action)
      parent = state.getElementById(action.addElement.parent[0]);
      // console.log('PARENT MY FRIEND', action.addElement.parent[0])
      // console.log('PARENT MY FRIEND', parent)
      // console.log('PARENT MY FRIEND', parent.index)
      // console.log('PARENT MY FRIEND', parent)

      element = factory.getElements()[action.addElement.element.key];

      // console.log('element MY FRIEND', element)
      console.log(1,state)

      //Add element to graph
      state.connectElements(
        [[parent.id, 0, 0]],
        element,
        parent.index[0],
        parent.index[1] + 1
      );
      console.log(2,state)
      return state;

    case "ADD_SPLITTER":
      let maxX = 0;
      let maxY = 0;
      console.log("ADD_SPLITTER MY FRIEND", action);
      // parent = state.getElementById(action.addElement.parents[0]);
      let arrayIds = [];
      for (const par of action.addElement.parents) {
        parent = state.getElementById(par);
        console.log("PARENT MY FRIEND", parent);

        if (parent.index[0] > maxX) {
          maxX = parent.index[0];
        }
        if (parent.index[1] > maxY) {
          maxY = parent.index[1];
        }

        arrayIds.push([par, 0, 0]);
      }

      element = factory.getElements()[action.addElement.element.key];
      console.log("element MY FRIEND", element);
      console.log(1, state);
      // let ids = action.addElement.parents.map(el => {return [el, 0, 0]})
      console.log("ids: ", arrayIds);
      console.log("element: ", element);
      console.log(maxX, maxY + 1);
      console.log("value:", action.addElement.value);

      //Add element to graph
      console.log(111, state);


      state.connectElements(arrayIds, element, maxX, maxY + 1, [
        {
          index: 0,
          value: action.addElement.value,
        },
      ]);

      console.log(222, state);
      return state;

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
