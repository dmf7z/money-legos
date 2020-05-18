pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Address.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "./GraphBase.sol";
import "./operations/OperationExecutor.sol";


contract Graph is GraphBase, OperationExecutor {
    string public constant VERSION = "1.0.0";

    using SafeMath for uint256;

    constructor(GraphBase.Element[] memory _elements) public {
        for (uint256 i; i < _elements.length; i++) {
            elements.length++;
            elements[i] = Element({
                hash: _elements[i].hash,
                addr: _elements[i].addr,
                params: _elements[i].params,
                outputsIndexes: _elements[i].outputsIndexes,
                outputsInputIndexes: _elements[i].outputsInputIndexes,
                x: _elements[i].x,
                y: _elements[i].y
            });
        }
    }

    /**
     * Fallback function accepts Ether transactions.
     */
    function() external payable {}

    /**
     * Execute many operations.
     * @param _paramsList params for each element to execute
     * @param _maxElementInputs max inputs an element has
     */
    function execute(bytes[] memory _paramsList, uint256 _maxElementInputs)
        public
        payable
    {
        uint256[][] memory inputs = new uint256[][](elements.length);
        for (uint256 i; i < elements.length; i++) {
            inputs[i] = new uint256[](_maxElementInputs);
        }
        for (uint8 i = 0; i < _paramsList.length; i++) {
            GraphBase.Element memory element = elements[i];
            bytes memory params = _paramsList[i];
            if (element.addr == address(1)) {
                //InputElement
                (address asset, uint256 amount) = abi.decode(
                    params,
                    (address, uint256)
                );
                if (asset != address(0)) {
                    //No transferFrom for ethers
                    IERC20(asset).transferFrom(
                        msg.sender,
                        address(this),
                        amount
                    );
                }
                //Input element has one output
                inputs[element.outputsIndexes[0]][element
                    .outputsInputIndexes[0]]
                    .add(amount);
            } else if (element.addr == address(2)) {
                //SplitterElement
                uint8 percentage = abi.decode(params, (uint8));
                uint256 firstShare = inputs[i][0].mul(percentage).div(100);
                //Spliiter element has one output
                inputs[element.outputsIndexes[0]][element
                    .outputsInputIndexes[0]]
                    .add(firstShare);
                inputs[element.outputsIndexes[1]][element
                    .outputsInputIndexes[1]]
                    .add(inputs[i][0])
                    .sub(firstShare);
            } else if (element.addr == address(3)) {
                //AddressElement
                address addr = abi.decode(params, (address));
                if (inputs[i][0] > 0) {
                    //ETH
                    Address.sendValue(msg.sender, inputs[i][0]);
                } else if (inputs[i][1] > 0) {
                    //DAI
                    IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F).transfer(
                        msg.sender,
                        inputs[i][1]
                    );
                } else if (inputs[i][2] > 0) {
                    // WETH
                    IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2).transfer(
                        msg.sender,
                        inputs[i][2]
                    );
                } else if (inputs[i][3] > 0) {
                    //USDC
                    IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48).transfer(
                        msg.sender,
                        inputs[i][3]
                    );
                } else if (inputs[i][4] > 0) {
                    //USDT
                    IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7).transfer(
                        msg.sender,
                        inputs[i][4]
                    );
                } else if (inputs[i][5] > 0) {
                    //SUSD
                    IERC20(0x57Ab1ec28D129707052df4dF418D58a2D46d5f51).transfer(
                        msg.sender,
                        inputs[i][5]
                    );
                } else if (inputs[i][6] > 0) {
                    //WBTC
                    IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599).transfer(
                        msg.sender,
                        inputs[i][6]
                    );
                } else if (inputs[i][7] > 0) {
                    //REP
                    IERC20(0x1985365e9f78359a9B6AD760e32412f4a445E862).transfer(
                        msg.sender,
                        inputs[i][7]
                    );
                } else if (inputs[i][8] > 0) {
                    //CDAI
                    IERC20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643).transfer(
                        msg.sender,
                        inputs[i][8]
                    );
                } else if (inputs[i][9] > 0) {
                    //CUSDC
                    IERC20(0x39AA39c021dfbaE8faC545936693aC917d5E7563).transfer(
                        msg.sender,
                        inputs[i][9]
                    );
                } else if (inputs[i][10] > 0) {
                    //CWBTC
                    IERC20(0xC11b1268C1A384e55C48c2391d8d480264A3A7F4).transfer(
                        msg.sender,
                        inputs[i][10]
                    );
                } else if (inputs[i][11] > 0) {
                    //CETH
                    IERC20(0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5).transfer(
                        msg.sender,
                        inputs[i][11]
                    );
                }
            } else {
                uint256[] memory outAmounts = executeOperation(
                    element.addr,
                    inputs[i],
                    element.params
                );
                //Redirect
                for (uint8 j = 0; j < element.outputsIndexes.length; j++) {
                    inputs[element.outputsIndexes[j]][element
                        .outputsInputIndexes[j]]
                        .add(outAmounts[j]);
                }
            }
        }
    }

    function getElements() public view returns (GraphBase.Element[] memory) {
        return elements;
    }
}
