pragma solidity ^0.5.0;


/**
 * @title ICurve
 */
contract ICurve {
    function exchange(
        uint128 i,
        uint128 j,
        uint256 dx,
        uint256 min_dy,
        uint256 timestamp
    ) public returns (uint256);
}
