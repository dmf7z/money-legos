pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./IMarketMatching.sol";


contract Op_Oasis {
    string public constant VERSION = "1.0.0";

    using SafeMath for uint256;

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
        uint256 offerId = abi.decode(_params, (uint256));

        uint256 payAmount;
        address payAsset;
        uint256 buyAmount;
        (payAmount, payAsset, buyAmount, ) = IMarketMatching(
            0x794e6e91555438aFc3ccF1c5076A74F42133d08D
        )
            .getOffer(offerId);

        uint256 toBuy = _inAmounts[0].mul(payAmount).div(buyAmount);

        IERC20(payAsset).approve(
            0x794e6e91555438aFc3ccF1c5076A74F42133d08D,
            _inAmounts[0]
        );
        require(
            IMarketMatching(0x794e6e91555438aFc3ccF1c5076A74F42133d08D).buy(
                offerId,
                toBuy
            ),
            "Oasis operation failed"
        );

        //Returns out assets amounts
        uint256[] memory outAmounts = new uint256[](1);
        outAmounts[0] = toBuy;
        return outAmounts;
    }
}
