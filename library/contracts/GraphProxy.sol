pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./GraphBase.sol";


contract GraphProxy is GraphBase {
    constructor(address _proxied, GraphBase.Element[] memory _elements) public {
        proxied = _proxied;
        for (uint256 i; i < _elements.length; i++) {
            elements.length++;
            elements[i] = Element({
                hash: _elements[i].hash,
                addr: _elements[i].addr,
                params: _elements[i].params,
                outputsIndexes: _elements[i].outputsIndexes,
                outputsInputIndexes: _elements[i].outputsInputIndexes,
                x: _elements[i].x,
                y: _elements[i].y
            });
        }
    }

    function() external payable {
        address addr = proxied;
        assembly {
            let freememstart := mload(0x40)
            calldatacopy(freememstart, 0, calldatasize())
            let success := delegatecall(
                not(0),
                addr,
                freememstart,
                calldatasize(),
                freememstart,
                32
            )
            switch success
                case 0 {
                    revert(freememstart, 32)
                }
                default {
                    return(freememstart, 32)
                }
        }
    }
}
