pragma solidity ^0.5.0;

import "./IWETH.sol";


contract Op_WrapETH {
    string public constant VERSION = "1.0.0";

    constructor() public {}

    /**
     * Execute the operation.
     * @param _inAmounts params is the amount to swap
     * @param _params params contains the min amount to buy and the time deadline
     */
    function operate(uint256[] memory _inAmounts, bytes memory _params)
        public
        payable
        returns (uint256[] memory outAmounts)
    {
        //Get params
        bool isWrap = abi.decode(_params, (bool));

        if (isWrap) {
            //Execute operation
            IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2).deposit.value(
                _inAmounts[0]
            )();
        } else {
            //Transformed WETH received to ETH
            IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2).withdraw(
                _inAmounts[0]
            );
        }

        //Returns out assets amounts
        outAmounts = new uint256[](1);
        outAmounts[0] = _inAmounts[0];
    }
}
