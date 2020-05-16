pragma solidity ^0.5.0;

/**
 * @title WETH Contract
 */
contract IWETH {
    /**
     * Switch back ETH to WETH
     */
    function deposit() public payable;

    /**
     * Switch back WETH to ETH
     * @param wad Value of ethers to withdraw
     */
    function withdraw(uint256 wad) public;
}
