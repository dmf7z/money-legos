pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./ICToken.sol";
import "./ICEth.sol";


contract Op_Compound {
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
        returns (uint256[] memory outAmounts)
    {
        //Get params
        (address ctoken, address asset, bool isLend) = abi.decode(
            _params,
            (address, address, bool)
        );

        outAmounts = new uint256[](1);

        //Execute operation
        if (isLend) {
            outAmounts[0] = _inAmounts[0]
                .mul(ICToken(ctoken).exchangeRateCurrent())
                .div(1 ether);
            if (asset == address(0)) {
                //ETH
                ICEth(ctoken).mint.value(_inAmounts[0])();
            } else {
                IERC20(asset).approve(ctoken, uint256(_inAmounts[0]));
                require(
                    ICToken(ctoken).mint(_inAmounts[0]) == 0,
                    "Compound lend token operation failed"
                );
            }
        } else {
            outAmounts[0] = _inAmounts[0].mul(1 ether).div(
                ICToken(ctoken).exchangeRateCurrent()
            );
            require(
                ICToken(ctoken).redeem(_inAmounts[0]) == 0,
                "Compound redeem  operation failed"
            );
        }
    }
}
