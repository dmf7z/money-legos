pragma solidity ^0.5.0;


contract GraphBase {
    address internal proxied;

    struct Element {
        string hash;
        address addr;
        bytes params;
        uint64[] outputsIndexes;
        uint64[] outputsInputIndexes;
        uint8 x;
        uint8 y;
    }

    Element[] public elements;
}
