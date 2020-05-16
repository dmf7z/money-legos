pragma solidity ^0.5.0;


contract GraphBase {
    address internal proxied;

    struct Element {
        address addr;
        bytes params;
        uint64[] elementOutputsIndexes;
        uint64[] elementOuputsOutIndexes;
    }

    Element[] public elements;
}
