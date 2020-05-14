pragma solidity ^0.5.0;


/**
 * @title IMarketMatching
 */
contract IMarketMatching {
    function getOffer(uint256 id)
        public
        view
        returns (uint256, address, uint256, address);

    function getBestOffer(address sell_gem, address buy_gem)
        public
        view
        returns (uint256);

    function buy(uint256 id, uint256 quantity) public returns (bool);
}
