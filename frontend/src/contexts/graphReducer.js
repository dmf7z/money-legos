import * as factory from "library";

export const graphReducer = (state, action) => {
  console.log("graphReducer action ", action);
  let parent;
  let maxX = 0;
  let maxY = 0;
  let arrayIds = [];
  let arrayData = [];
  let elementPort = 0;
  let element;
  let rawData;
  let limitX

  switch (action.type) {
    case "ADD_INPUT":
      element = factory.getElements()[`INPUT_${action.addElement.asset}`];
      state.addElement(element, action.addElement.limit, 0);
      return state;
    case "ADD_FLASH_SWAP":
      element = factory.getElements()[
        `FLASH_SWAP_IN_${action.addElement.asset}`
      ];
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

        for (const i of Object.keys(action.addElement.selectedElement.executionData)) {
          if (action.addElement.selectedElement.executionData[i].type == "input" && action.addElement.data[i]) {
            // console.log('adding data for index: ', i, data[i])
            // state.setExecutionData(selectedElement.id, i, data[i]);
            rawData = action.addElement.data[i]
            if(action.addElement.selectedElement.key.includes('0x')){rawData = JSON.parse(action.addElement.data[i]) }
            arrayData.push(
              {
                index: i,
                value: rawData,
              },
            )
          }
        }

        const asset = parent.outputs[0];
        const inputIndex = element.inputs.indexOf(asset);

        arrayIds.push([par, elementPort, inputIndex]);
      }

      //Add element to graph
      state.connectElements(arrayIds, element, maxX, maxY + 1, arrayData);

      return state;

    case "ADD_SPLITTER":
      console.log("ADD_SPLITTER", action);
      for (const par of action.addElement.parents) {
        parent = state.getElementById(par);

        if (parent.index[0] > maxX) {
          maxX = parent.index[0];
        }
        if (parent.index[1] > maxY) {
          maxY = parent.index[1];
        }

        arrayIds.push([par, elementPort, 0]);
      }

      for (const i of Object.keys(action.addElement.selectedElement.executionData)) {
        if (action.addElement.selectedElement.executionData[i].type == "input" && action.addElement.data[i]) {
          console.log('adding data for index: ', i, action.addElement.data[i])
          // state.setExecutionData(selectedElement.id, i, data[i]);
          arrayData.push(
            {
              index: i,
              value: action.addElement.data[i],
            },
          )
        }
      }

      element = factory.getElements()[action.addElement.element.key];
      state.connectElements(arrayIds, element, maxX, maxY + 1, arrayData);
      return state;

    case "ADD_OUTPUT":
      console.log("ADD_ADDRESS", action);
      element = factory.getElements()[action.addElement.selectedElement.key];

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
          limitX = action.addElement.limit 
          //FIXME this is a workaround for limit now updating
          if(action.addElement.limit == parent.index[0]){ limitX = action.addElement.limit + 1 }
          maxX = limitX;
          console.log("New Max ", maxX);
        }

        const asset = parent.outputs[0];
        const inputIndex = element.inputs.indexOf(asset);

        arrayIds.push([par, elementPort, inputIndex]);
        console.log(arrayIds, element, asset, inputIndex);
      }

      for (const i of Object.keys(action.addElement.selectedElement.executionData)) {
        if (action.addElement.selectedElement.executionData[i].type == "input" && action.addElement.data[i]) {
          console.log('adding data for index: ', i, action.addElement.data[i])
          // state.setExecutionData(selectedElement.id, i, data[i]);
          arrayData.push(
            {
              index: i,
              value: action.addElement.data[i],
            },
          )
        }
      }

      state.connectElements(arrayIds, element, maxX, maxY + 1, arrayData);

      return state;

    case "ADD_GRAPH":
      element = factory.getElements().INPUT_DAI;
      state.addElement(element, 0, 0);

      // console.log("2 state ", state);
      // return state[action.element.pos[1]][action.element.pos[0]] = action.element
      return state;

    case "LOAD_GRAPH":
      // console.log("2 state ", state);
      // console.log("2 action ", action);
      // return state[action.element.pos[1]][action.element.pos[0]] = action.element
      return action.lg;

    case "ADD_DATA":
      console.log("2 action ", action);
      // const { selectedElement, data } = action.addElement;
      // element = state.getElementById(par);

      for (const i of Object.keys(action.addElement.selectedElement.executionData)) {
        if (action.addElement.selectedElement.executionData[i].type == "input" && action.addElement.data[i]) {
          console.log('adding data for index: ', i, action.addElement.data[i])
          state.setExecutionData(action.addElement.selectedElement.id, i, action.addElement.data[i]);
        }
      }

      // console.log("2 state ", state);
      // return state[action.element.pos[1]][action.element.pos[0]] = action.element
      return state;

    case "CLEAR_STACK":
      return [];

    default:
      throw new Error();
  }
};
