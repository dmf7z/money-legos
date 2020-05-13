pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "./IUniswap.sol";


contract Op_Uniswap {
    string public constant VERSION = "1.0.0";

    constructor() public {}

    /**
     * Execute the operation.
     * @param _inAmounts params is the amount to swap
     * @param _params params contains the min amount to buy and the time deadline
     */
    function operate(uint256[] memory _inAmounts, bytes memory _params)
        internal
        returns (uint256[] memory)
    {
        //Get params
        address exchange;
        address asset;
        bool tokenToEth;
        uint256 minOutAsset;
        uint256 deadline;
        (exchange, asset, tokenToEth, minOutAsset, deadline) = abi.decode(
            _params,
            (address, address, bool, uint256, uint256)
        );

        //Execute operation
        uint256 bought;
        if (tokenToEth) {
            //Apprive token
            IERC20(asset).approve(exchange, uint256(-1));
            bought = IUniswap(exchange).tokenToEthSwapInput(
                _inAmounts[0],
                minOutAsset,
                deadline
            );
        } else {
            bought = IUniswap(exchange).ethToTokenSwapInput.value(
                _inAmounts[0]
            )(minOutAsset, deadline);
        }

        require(bought > 0, "Uniswap operation failed");

        //Returns out assets amounts
        uint256[] memory outAmounts = new uint256[](1);
        outAmounts[0] = bought;
        return outAmounts;
    }
}