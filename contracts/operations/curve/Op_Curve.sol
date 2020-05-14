pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "./ICurve.sol";


contract Op_Curve {
    string public constant VERSION = "1.0.0";

    constructor() public {}

    /**
     * Execute the operation.
     * @param _inAmounts params is the amount to swap
     * @param _params params contains the min amount to buy and the time deadline
     */
    function operate(uint256[] memory _inAmounts, bytes memory _params)
        public
        returns (uint256[] memory)
    {
        //Get params
        (
            address pool,
            uint128 indexAsset1,
            uint128 indexAsset2,
            uint256 minAsset2,
            uint256 deadline
        ) = abi.decode(_params, (address, uint128, uint128, uint256, uint256));

        //Execute operation
        uint256 outAmount = ICurve(pool).exchange(
            indexAsset1,
            indexAsset2,
            _inAmounts[0],
            minAsset2,
            deadline
        );

        require(outAmount > 0, "Curve operation failed");

        //Returns out assets amounts
        uint256[] memory outAmounts = new uint256[](1);
        outAmounts[0] = outAmount;
        return outAmounts;
    }
}
