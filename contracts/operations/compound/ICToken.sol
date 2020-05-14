pragma solidity ^0.5.0;

/**
 * @title ICToken
 */
contract ICToken {
    function mint(uint256 mintAmount) external returns (uint256);

    function redeem(uint256 redeemTokens) external returns (uint256);

    function exchangeRateCurrent() public returns (uint256);
}
