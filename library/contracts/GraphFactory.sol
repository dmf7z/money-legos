pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./GraphBase.sol";
import "./Graph.sol";


/**
 * @title GraphFactory
 * @dev Factory of graph proxy.
 */
contract GraphFactory {
    event GraphCreated(address);

    constructor() public {
    }

    /**
     * Create new portfolio proxy instance.
     * @param _elements elements of the graph.
     */
    function createInstance(GraphBase.Element[] memory _elements) public {
        Graph proxy = new Graph(_elements);

        emit GraphCreated(address(proxy));
    }
}
