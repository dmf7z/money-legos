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

    function isValidOrderSignature(bytes memory _params)
        public
        view
        returns (bool isValid)
    {
        (
            IExchange.Order memory order,
            bytes memory signature,
            address asset
        ) = abi.decode(_params, (IExchange.Order, bytes, address));
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
        payable
        returns (uint256[] memory outAmounts)
    {
        (
            IExchange.Order memory order,
            bytes memory signature,
            address asset
        ) = abi.decode(_params, (IExchange.Order, bytes, address));
        IERC20(asset).approve(
            0x95E6F48254609A6ee006F7D493c8e5fB97094ceF,
            _inAmounts[0]
        );

        IExchange.FillResults memory results = IExchange(
            0x61935CbDd02287B511119DDb11Aeb42F1593b7Ef
        )
            .fillOrder
            .value(_inAmounts[1])(order, _inAmounts[0], signature); //fee: tx.gasprice * 150000

        //Returns out assets amounts
        outAmounts = new uint256[](1);
        outAmounts[0] = results.makerAssetFilledAmount;
    }
}
