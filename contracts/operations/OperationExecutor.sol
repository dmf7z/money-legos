pragma solidity ^0.5.0;


contract OperationExecutor {
    string public constant VERSION = "1.0.0";

    constructor() public {}

    /**
     * Fallback function accepts Ether transactions.
     */
    function() external payable {}

    /**
     * Execute the operation.
     * @param _operation operaetion to execute
     * @param _inAmounts params is the amount to swap
     * @param _params params contains the min amount to buy and the time deadline
     */
    function executeOperation(
        address _operation,
        uint256[] memory _inAmounts,
        bytes memory _params
    ) public {
        bytes memory data = abi.encodeWithSelector(
            bytes4(keccak256("operate(uint256[],bytes)")),
            _inAmounts,
            _params
        );
        (bool success, bytes memory returnedData) = _operation.delegatecall(
            data
        );

        require(success);

        uint256[] memory outAmounts = abi.decode(returnedData, (uint256[]));

        // require(outAmounts[0] == 1, "error");
    }
}
