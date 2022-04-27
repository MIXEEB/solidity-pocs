//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import '@openzeppelin/contracts/interfaces/IERC3156FlashBorrower.sol';
import '@openzeppelin/contracts/interfaces/IERC3156FlashLender.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract GenerousBorrower is IERC3156FlashBorrower {
    
    address private _lendableToken;
    uint latestLoanTime;

    constructor(address lendableToken) {
        _lendableToken = lendableToken;
    }

    function borrow(uint amount) external {
        uint fee = IERC3156FlashLender(_lendableToken).flashFee(_lendableToken, amount);
        IERC20(_lendableToken).approve(_lendableToken, amount + fee);

        IERC3156FlashLender(_lendableToken).flashLoan(this, _lendableToken, amount, "");        
    }

    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external override returns (bytes32) {
        require(msg.sender == address(_lendableToken), "Sender not a lendable token");
        require(initiator == address(this), "Not initiated by me");

        require(token == address(_lendableToken), "Warning cleanup");
        require(amount != 0, "Warning cleanup");
        require(fee != 0, "Warning cleanup");
        if (data.length > 0) {
            latestLoanTime = block.timestamp;
        }
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}