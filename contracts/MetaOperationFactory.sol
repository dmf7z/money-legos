// pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

// import "./Base.sol";
// import "./MetaOperation.sol";

// contract MetaOperationFactory is Base {

//     event MetaOperationCreated(address);

//     function deploy( MetaOperation.Operation[] calldata _operations) external {
//         require(_operations.length > 1, "MetaOperation must have at least two operations");
//         MetaOperation metaOperation = new MetaOperation(_operations);
//         emit MetaOperationCreated(address(metaOperation));
//     }
// }