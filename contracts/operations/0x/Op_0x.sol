pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "./IExchange.sol";


contract Op_0x {
    string public constant VERSION = "1.0.0";

    constructor() public {}

    function encodeParams(
        IExchange.Order memory order,
        bytes memory signature,
        address asset
    ) public pure returns (bytes memory) {
        return abi.encode(order, signature, asset);
    }

    function isValidOrderSignature(
        IExchange.Order memory order,
        bytes memory signature
    ) public view returns (bool isValid) {
        return
            IExchange(0x61935CbDd02287B511119DDb11Aeb42F1593b7Ef)
                .isValidOrderSignature(order, signature);
    }

    /**
     * Execute the operation.
     * @param _inAmounts params is the amount to swap
     * @param _params params contains the min amount to buy and the time deadline
     */
    function operate(uint256[] memory _inAmounts, bytes memory _params)
        public
        returns (uint256[] memory)
    {
        (
            IExchange.Order memory order,
            bytes memory signature,
            address asset
        ) = abi.decode(_params, (IExchange.Order, bytes, address));
        IERC20(asset).approve(
            0x61935CbDd02287B511119DDb11Aeb42F1593b7Ef,
            _inAmounts[0]
        );
        IExchange.FillResults memory results = IExchange(
            0x61935CbDd02287B511119DDb11Aeb42F1593b7Ef
        )
            .fill(order, _inAmounts[0], signature);

        //Returns out assets amounts
        uint256[] memory outAmounts = new uint256[](1);
        //  outAmounts[0] = results.makerAssetFilledAmount;
        return outAmounts;
    }
}
