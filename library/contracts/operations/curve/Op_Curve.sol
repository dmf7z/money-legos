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
        payable
        returns (uint256[] memory outAmounts)
    {
        //Get params
        (
            address pool,
            address asset,
            int128 indexAsset1,
            int128 indexAsset2,
            uint256 minAsset2
        ) = abi.decode(_params, (address, address, int128, int128, uint256));

        IERC20(asset).approve(pool, _inAmounts[0]);

        outAmounts = new uint256[](1);
        outAmounts[0] = ICurve(pool).get_dy(
            indexAsset1,
            indexAsset2,
            _inAmounts[0]
        );

        //Execute operation
        ICurve(pool).exchange(
            indexAsset1,
            indexAsset2,
            _inAmounts[0],
            minAsset2
        );
    }
}
