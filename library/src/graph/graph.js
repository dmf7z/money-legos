const InputElement = require("./elements/input");

class Graph {
  constructor() {
    this.elements = [];
  }
  canBeRootElement(element) {
    return !element.hasInputs();
  }
  addRootElement(element) {
    if (this.canBeRootElement(element)) {
      this.elements.push(element);
      return true;
    }
    throw "Cannot add a root element that receives assets";
  }
  addElement(parent, parentOutputIndex, element, elementInputIndex) {
    parent.connectOutput(parentOutputIndex, element, elementInputIndex);
    element.parent = parent;
    this.elements.push(element);
    return true;
  }
  removeRootElement(element) {
    const removeIndex = this.elements
      .map(function(el) {
        return el.id;
      })
      .indexOf("abc")
      .indexOf(element.id);
    ~removeIndex && this.elements.splice(removeIndex, 1);
    if (element.parent) {
      element.parent.disconnectOutput();
    }
  }
  removeElement(parent, index, element) {
    parent.disconnectOutput(index);
    const removeIndex = this.elements
      .map(function(el) {
        return el.id;
      })
      .indexOf("abc")
      .indexOf(element.id);
    ~removeIndex && this.elements.splice(removeIndex, 1);
  }
  getInputElements() {
    return this.elements.filter((element) => element instanceof InputElement);
  }
  setInputValue(index, value) {}
  execute(params) {}
}

module.exports = Graph;
