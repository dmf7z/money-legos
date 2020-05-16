pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract OperationExecutor {
    struct Operation {
        address addr;
        uint256[] inAmounts;
        bytes params;
    }

    constructor() public {}

    /**
     * Fallback function accepts Ether transactions.
     */
    function() external payable {}

    /**
     * Execute one operation.
     * @param _operation operaetion to execute
     * @param _inAmounts params is the amount to swap
     * @param _params params contains the min amount to buy and the time deadline
     */
    function executeOperation(
        address _operation,
        uint256[] memory _inAmounts,
        bytes memory _params
    ) public returns (uint256[] memory) {
        bytes memory data = abi.encodeWithSelector(
            bytes4(keccak256("operate(uint256[],bytes)")),
            _inAmounts,
            _params
        );
        (bool success, bytes memory returnedData) = _operation.delegatecall(
            data
        );
        require(success, string(returnedData));
        return abi.decode(returnedData, (uint256[]));
    }

    /**
     * Execute many operations.
     * @param _operations operaetions to execute
     */
    function executeOperations(Operation[] memory _operations) public {
        for (uint8 i = 0; i < _operations.length; i++) {
            executeOperation(
                _operations[i].addr,
                _operations[i].inAmounts,
                _operations[i].params
            );
        }
    }
}
