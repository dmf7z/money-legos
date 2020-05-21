export const uiReducer = (state, action) => {
  console.log("uiReducer action ", action);
  switch (action.type) {
    case "SELECT_ELEMENT":
      return state.concat(action.id);
    case "UNSELECT_ELEMENT":
      let filter = state.filter((obj) => obj != action.id);
      return filter;
    case "CLEAR_SELECTED":
      return [];
    default:
      throw new Error();
  }
};
