pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./GraphBase.sol";
import "./GraphProxy.sol";


/**
 * @title GraphFactory
 * @dev Factory of graph proxy.
 */
contract GraphFactory {
    event GraphProxyCreated(address);

    address public graph;

    constructor(address _graph) public {
        graph = _graph;
    }

    /**
     * Create new portfolio proxy instance.
     * @param _elements elements of the graph.
     */
    function createInstance(GraphBase.Element[] memory _elements) public {
        GraphProxy proxy = new GraphProxy(graph, _elements);

        emit GraphProxyCreated(address(proxy));
    }
}
