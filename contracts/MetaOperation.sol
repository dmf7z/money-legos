// pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

// import "@openzeppelin/contracts-ethereum-package/contracts/utils/Address.sol";
// import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
// import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
// import "./Base.sol";
// import "./IOperation.sol";


// /**
//  * @title MetaOperation
//  */
// contract MetaOperation is Base {
//     using SafeMath for uint256;

//     Operation[] public operations;

//     /**
//      * Initialize the contract.
//      * @param _operations to execute.
//      */
//     constructor(Operation[] memory _operations) public {
//         //Need to do this: Copying of type struct Base.Out memory[] memory to storage not yet supported.
//         operations.length = _operations.length;
//         for (uint8 i = 0; i < _operations.length; i++) {
//             operations[i].addr = _operations[i].addr;
//             operations[i].inAmounts = _operations[i].inAmounts;
//             operations[i].outs.length = _operations[i].outs.length;
//             operations[i].params = _operations[i].params;
//             for (uint8 j = 0; j < _operations[i].outs.length; j++) {
//                 operations[i].outs[j] = _operations[i].outs[j];
//             }
//         }
//     }

//     /**
//      * Execute an operation.
//      * @param _params params of operations.
//      */
//     function executeOperations(bytes[] calldata _params) external {
//         for (uint8 i = 0; i < operations.length; i++) {
//             _executeOperation(operations[i], _params[i]);
//         }
//     }

//     /**
//      * Execute an operations.
//      * @param _operation operation to execute.
//      * @param _params params of operations.
//      */
//     function _executeOperation(
//         Operation memory _operation,
//         bytes memory _params
//     ) private {
//         bytes memory params = _params.length == 0 ? _params : _operation.params;
//         if (
//             _operation.addr ==
//             address(0x0000000000000000000000000000000000000001)
//         ) {
//             //Input element
//             _redirectInputOutput(_operation, params);
//         } else if (
//             _operation.addr ==
//             address(0x0000000000000000000000000000000000000002)
//         ) {
//             //Split element
//             _redirectSplitterOutputs(_operation);
//         } else {
//             address[] memory outAssets = IOperation(_operation.addr)
//                 .getOutAssets(params);

//             uint256[] memory outAmounts;
//             outAmounts = IOperation(_operation.addr).operate(params);

//             _redirectOperationOutputs(_operation, outAssets, outAmounts);

//             //Transfer out assets to sender
//             _transferAssetsToSender(outAssets);
//         }
//     }

//     /**
//      * Redirect oepration output
//      * @param _to address to redirect to.
//     * @param _asset asset to redirect to.
//      * @param _amount amount to redirect to.
//      * @param _fromSender true if redirect directly from sender

//      */
//     function _redirectOutput(
//         address payable _to,
//         address _asset,
//         uint256 _amount,
//         bool _fromSender
//     ) private {
//         if (_asset == address(0)) {
//             Address.sendValue(_to, _amount);
//         } else {
//             if (_fromSender) {
//                 IERC20(_asset).transferFrom(msg.sender, _to, _amount);
//             } else {
//                 IERC20(_asset).transfer(_to, _amount);
//             }
//         }
//     }

//     /**
//      * Execute an operation.
//      * @param _operation input operation.
//      */
//     function _redirectInputOutput(
//         Operation memory _operation,
//         bytes memory _params
//     ) private {
//         require(
//             _operation.outs.length == 1,
//             "Input operation can only have one out asset"
//         );
//         Out memory out = _operation.outs[0];
//         //Params contains the amount to execute
//         uint256 amount = abi.decode(_params, (uint256));
//         _redirectOutput(out.to, out.asset, amount, true);
//     }

//     /**
//      * Execute an operation.
//      * @param _operation splitter operation.
//      */
//     function _redirectSplitterOutputs(
//         Operation memory _operation
//     ) private {
//         //Manage out assets
//         require(
//             _operation.outs.length == 2,
//             "Splitter operation must have two out assets"
//         );
//         Out memory out1 = _operation.outs[0];
//         Out memory out2 = _operation.outs[1];
//         require(
//             out1.asset == out2.asset,
//             "Splitter out assets must be the same"
//         );
//         _redirectOutput(out1.to, out1.asset, out1.amount, false);

//         _redirectOutput(out2.to, out2.asset, out2.amount, false);
//     }

//     /**
//      * Execute an operation.
//      * @param _operation operation that redirects outputs.
//      * @param _outAssets operation out assets.
//      * @param _outAmounts operation out amounts.
//      */
//     function _redirectOperationOutputs(
//         Operation memory _operation,
//         address[] memory _outAssets,
//         uint256[] memory _outAmounts
//     ) private {
//         //Manage out assets
//         for (uint8 i = 0; i < _operation.outs.length; i++) {
//             Out memory out = _operation.outs[i];
//             //Get index
//             uint256 index = getAssetIndexFromArray(out.asset, _outAssets);
//             //Manage if fixed or percentage
//             if (out.isPercentage) {
//                 _redirectOutput(
//                     out.to,
//                     out.asset,
//                     _outAmounts[index].mul(out.amount).div(1 ether),
//                     false
//                 );
//             } else {
//                 require(
//                     out.amount < _outAmounts[index],
//                     "Output amount less than the specified to redirect"
//                 );
//                 _redirectOutput(out.to, out.asset, out.amount, false);
//             }
//         }
//     }

//     /**
//      * Returns the index of an asset.
//      * If not found, returns array length.
//      * @param _asset asset to get index.
//      * @param _assets array containing the assets.
//      */
//     function getAssetIndexFromArray(address _asset, address[] memory _assets)
//         private
//         pure
//         returns (uint256)
//     {
//         for (uint256 i = 0; i < _assets.length; i++) {
//             if (_assets[i] == _asset) {
//                 return i;
//             }
//         }
//         return _assets.length;
//     }

//     /**
//      * Transfer all asset balance from this contract to sender.
//      * @param _outAssets list of assets to transfer.
//      */
//     function _transferAssetsToSender(address[] memory _outAssets) private {
//         //Manage in assets
//         for (uint8 i = 0; i < _outAssets.length; i++) {
//             address asset = _outAssets[i];
//             if (asset != address(0)) {
//                 uint256 amount = IERC20(asset).balanceOf(address(this));
//                 IERC20(asset).transfer(msg.sender, amount);
//             } else {
//                 uint256 ethBalance = address(this).balance;
//                 Address.sendValue(msg.sender, ethBalance);
//             }
//         }
//     }
// }
