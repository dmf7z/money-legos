import * as factory from "library";

export const graphReducer = (state, action) => {
  console.log("graphReducer action ", action);
  let parent;
  let maxX = 0;
  let maxY = 0;
  let arrayIds = [];
  let elementPort = 0;
  let element;


  switch (action.type) {
    case "ADD_INPUT":
      element = factory.getElements()[`INPUT_${action.addElement.asset}`];
      state.addElement(element, action.addElement.limit, 0);
      return state;

    case "ADD_OPERATION":
      element = factory.getElements()[action.addElement.selectedElement.key];

      for (const par of action.addElement.parents) {
        parent = state.getElementById(par);
        console.log("PARENT MY FRIEND", parent);

        if (parent.index[0] > maxX) {
          maxX = parent.index[0];
        }
        if (parent.index[1] > maxY) {
          maxY = parent.index[1];
        }

        if (
          parent.type == "SplitterElement" &&
          parent.connections.length == 1
        ) {
          elementPort = parent.connections.length;
          maxX = action.addElement.limit;
          console.log("New Max ", maxX);
        }

        arrayIds.push([par, elementPort, 0]);
      }

      //Add element to graph
      state.connectElements(arrayIds, element, maxX, maxY + 1);

      return state;

    case "ADD_SPLITTER":
      console.log("ADD_SPLITTER MY FRIEND", action);
      for (const par of action.addElement.parents) {
        parent = state.getElementById(par);
        console.log("PARENT MY FRIEND", parent);

        if (parent.index[0] > maxX) {
          maxX = parent.index[0];
        }
        if (parent.index[1] > maxY) {
          maxY = parent.index[1];
        }

        arrayIds.push([par, elementPort, 0]);
      }

      element = factory.getElements()[action.addElement.element.key];

      state.connectElements(arrayIds, element, maxX, maxY + 1, [
        {
          index: 0,
          value: action.addElement.value,
        },
      ]);

      return state;
    case "ADD_ADDRESS":
      console.log("ADD_ADDRESS MY FRIEND", action);
      element = factory.getElements()[action.addElement.element.key];

      for (const par of action.addElement.parents) {
        parent = state.getElementById(par);

        if (parent.index[0] > maxX) {
          maxX = parent.index[0];
        }
        if (parent.index[1] > maxY) {
          maxY = parent.index[1];
        }

        if (
          parent.type == "SplitterElement" &&
          parent.connections.length == 1
        ) {
          elementPort = parent.connections.length;
          maxX = action.addElement.limit;
          console.log("New Max ", maxX);
        }

        const asset = parent.outputs[0];
        const inputIndex = element.inputs.indexOf(asset);

        arrayIds.push([par, elementPort, inputIndex]);
      }

      state.connectElements(arrayIds, element, maxX, maxY + 1, [
        {
          index: 0,
          value: action.addElement.data.destinationaddress,
        },
      ]);

      return state;

    case "ADD_GRAPH":
      element = factory.getElements().INPUT_DAI;
      state.addElement(element, 0, 0);

      console.log("2 state ", state);
      // return state[action.element.pos[1]][action.element.pos[0]] = action.element
      return state;

    case "LOAD_GRAPH":
      console.log("2 state ", state);
      console.log("2 action ", action);
      // return state[action.element.pos[1]][action.element.pos[0]] = action.element
      return action.lg;

    case "ADD_DATA":
      console.log("2 action ", action);
      const {selectedElement, data} = action.addElement
      // element = state.getElementById(par);

      for (const i of Object.keys(selectedElement.executionData) ) {
        console.log('XOXOX',i,data[i]);
        state.setExecutionData(selectedElement.id, i, data[i]);
      }


      console.log("2 state ", state);
      // return state[action.element.pos[1]][action.element.pos[0]] = action.element
      return state;

    case "CLEAR_STACK":
      return [];

    default:
      throw new Error();
  }
};
