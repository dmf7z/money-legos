pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Base {
    struct Out {
        address asset;
        uint256 amount;
        bool isPercentage;
        address payable to;
    }

    struct Operation {
        address addr;
        uint256[] inAmounts;
        Out[] outs;
        bytes params;
    }
}