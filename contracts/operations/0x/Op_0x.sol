pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "./IExchange.sol";


contract Op_0x {
    string public constant VERSION = "1.0.0";

    constructor() public {}

    function getOrder(bytes memory _params)
        internal
        returns (IExchange.Order memory order, bytes memory signature)
    {
        address makerAddress; // Address that created the order.
        address takerAddress; // Address that is allowed to fill the order. If set to 0, any address is allowed to fill the order.
        address feeRecipientAddress; // Address that will recieve fees when order is filled.
        address senderAddress; // Address that is allowed to call Exchange contract methods that affect this order. If set to 0, any address is allowed to call these methods.
        uint256 makerAssetAmount; // Amount of makerAsset being offered by maker. Must be greater than 0.
        uint256 takerAssetAmount; // Amount of takerAsset being bid on by maker. Must be greater than 0.
        uint256 makerFee; // Fee paid to feeRecipient by maker when order is filled.
        uint256 takerFee; // Fee paid to feeRecipient by taker when order is filled.
        uint256 expirationTimeSeconds; // Timestamp in seconds at which order expires.
        uint256 salt; // Arbitrary number to facilitate uniqueness of the order's hash.
        bytes memory makerAssetData; // Encoded data that can be decoded by a specified proxy contract when transferring makerAsset. The leading bytes4 references the id of the asset proxy.
        bytes memory takerAssetData; // Encoded data that can be decoded by a specified proxy contract when transferring takerAsset. The leading bytes4 references the id of the asset proxy.
        bytes memory makerFeeAssetData; // Encoded data that can be decoded by a specified proxy contract when transferring makerFeeAsset. The leading bytes4 references the id of the asset proxy.
        bytes memory takerFeeAssetData; // Encoded data
        (
            makerAddress,
            takerAddress,
            feeRecipientAddress,
            senderAddress,
            makerAssetAmount,
            takerAssetAmount,
            makerFee,
            takerFee,
            expirationTimeSeconds,
            salt,
            makerAssetData,
            takerAssetData,
            makerFeeAssetData,
            takerFeeAssetData,
            signature
        ) = abi.decode(
            _params,
            (
                address,
                address,
                address,
                address,
                uint256,
                uint256,
                uint256,
                uint256,
                uint256,
                uint256,
                bytes,
                bytes,
                bytes,
                bytes,
                bytes
            )
        );

        order = IExchange.Order({
            makerAddress: makerAddress,
            takerAddress: takerAddress,
            feeRecipientAddress: feeRecipientAddress,
            senderAddress: senderAddress,
            makerAssetAmount: makerAssetAmount,
            takerAssetAmount: takerAssetAmount,
            makerFee: makerFee,
            takerFee: takerFee,
            expirationTimeSeconds: expirationTimeSeconds,
            salt: salt,
            makerAssetData: makerAssetData,
            takerAssetData: takerAssetData,
            makerFeeAssetData: makerFeeAssetData,
            takerFeeAssetData: takerFeeAssetData
        });
    }

    /**
     * Execute the operation.
     * @param _inAmounts params is the amount to swap
     * @param _params params contains the min amount to buy and the time deadline
     */
    function operate(uint256[] memory _inAmounts, bytes memory _params)
        internal
        returns (uint256[] memory)
    {
        IExchange.Order memory order;
        bytes memory signature;
        (order, signature) = getOrder(_params);
        IERC20(order.takerAddress).approve(
            0x794e6e91555438aFc3ccF1c5076A74F42133d08D,
            _inAmounts[0]
        );
        IExchange.FillResults memory results = IExchange(
            0x794e6e91555438aFc3ccF1c5076A74F42133d08D
        )
            .fillOrKillOrder(order, _inAmounts[0], signature);

        //Returns out assets amounts
        uint256[] memory outAmounts = new uint256[](1);
        outAmounts[0] = results.makerAssetFilledAmount;
        return outAmounts;
    }
}
