pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./IPair.sol";


contract Op_Uniswap_V2 {
    string public constant VERSION = "1.0.0";

    using SafeMath for uint256;

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
        (address pair, address asset1, address asset2) = abi.decode(
            _params,
            (address, address, address)
        );

        //Sort tokens
        (address token0, ) = asset1 < asset2
            ? (asset1, asset2)
            : (asset2, asset1);

        (uint256 reserve0, uint256 reserve1, ) = IPair(pair).getReserves();

        (uint256 reserveIn, uint256 reserveOut) = asset1 == token0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);

        uint256 amountInWithFee = _inAmounts[0].mul(997);
        outAmounts = new uint256[](1);
        outAmounts[0] = amountInWithFee.mul(reserveOut).div(
            reserveIn.mul(1000).add(amountInWithFee)
        );

        if (outAmounts[0] > 0) {
            IERC20(asset1).transfer(pair, _inAmounts[0]);
            //Execute operation
            IPair(pair).swap(
                asset1 == token0 ? 0 : outAmounts[0],
                asset1 == token0 ? outAmounts[0] : 0,
                address(this),
                ""
            );
        }
    }
}
