pragma solidity ^0.5.0;


/**
 * @title ICurve
 */
contract ICurve {
    function get_dy(int128 i, int128 j, uint256 dx) public returns (uint256) {}

    function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) public {}
}
