pragma solidity ^0.5.0;

/**
 * @title IOperation
 * @dev Interface for Defire operation contracts.
 */
interface IOperation {
    /**
     * Execute the operation.
     * @param _params params of the operation.
     */
    function operate(bytes calldata _params)
        external
        payable
        returns (uint256[] memory);

    /**
     * Returns the assets that the operation receives.
     * @param _params params of the operation.
     */
    function getInAssets(bytes calldata _params)
        external
        view
        returns (address[] memory);

    /**
     * Returns the assets that the operation returns.
     * @param _params params of the operation.
     */
    function getOutAssets(bytes calldata _params)
        external
        view
        returns (address[] memory);
}
