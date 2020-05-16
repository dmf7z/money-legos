pragma solidity ^0.5.0;

contract IOperation {
    string public constant VERSION = "1.0.0";

    constructor() public {}

    function operate(uint256[] memory _inAmounts, bytes memory _params)
        public
        returns (uint256[] memory)
    {}
}
