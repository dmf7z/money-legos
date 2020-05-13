pragma solidity ^0.5.0;

/**
 * @title IMarketMatching
 */
interface IMarketMatching {
    function getOffer(uint256 id)
        external
        view
        returns (uint256, address, uint256, address);

    function buy(uint256 id, uint256 quantity) external returns (bool);
}
