class Graph {
  constructor() {
    this.initialElements = [];
  }
  canBeRootElement(element) {
    return !element.hasInputs();
  }
  addRootElement(element) {
    if (this.canBeRootElement(element)) {
      this.initialElements.push(element);
      return true;
    }
    throw "Cannot add a root element that receives assets";
  }
  removeRootElement(element) {
    const removeIndex = this.initialElements
      .map(function (el) {
        return el.id;
      })
      .indexOf("abc")
      .indexOf(element.id);
    ~removeIndex && this.initialElements.splice(removeIndex, 1);
  }
  getInputs() {}
  setInputValue(index, value) {}
  deploy() {}
  execute(params) {}
}

module.exports = Graph;
