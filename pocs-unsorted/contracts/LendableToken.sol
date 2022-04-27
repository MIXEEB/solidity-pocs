//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import '@openzeppelin/contracts/interfaces/IERC3156FlashLender.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract LendableToken is ERC20, Ownable, IERC3156FlashLender  {

    uint256 private _feeMultiplier;
    uint256 private _feeDivider;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _feeMultiplier = 10;
        _feeDivider = 100;
    }

    function _getFee(uint256 amount) internal view returns(uint256) {
        require((type(uint256).max / _feeDivider) > amount, "Fee not calculatable for this small amount");
        return amount * _feeMultiplier / _feeDivider;
    }

    function _getMaxLoanAllowed() internal view returns(uint256) {
        return ((type(uint256).max - totalSupply()) / _feeMultiplier); 
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function maxFlashLoan(address token) external override view returns (uint256) {
        require(token == address(this), "Can land only this token.");
        return _getMaxLoanAllowed();
    }

    function flashFee(address token, uint256 amount) external override view returns (uint256) {
        require(token == address(this), "Can land only this token.");
        return _getFee(amount);
    }

    function flashLoan(
        IERC3156FlashBorrower receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external override returns (bool) {
        require(token == address(this), "Can only lend this token");
        require(amount <= _getMaxLoanAllowed(), "Amount exeeds alowed.");

        uint256 fee = _getFee(amount);
        _mint(address(receiver), amount);

        bytes32 CALLBACK_SUCCESS = keccak256("ERC3156FlashBorrower.onFlashLoan");
        require(receiver.onFlashLoan(msg.sender, token, amount, fee, data) == CALLBACK_SUCCESS, "FlashMinter: Callback failed");

        uint allowance = allowance(address(receiver), address(this));
        require(allowance >= (amount + fee), "Repay is not approved by borrower");

        _approve(address(receiver), address(this), allowance - (amount + fee));
        _burn(address(receiver), amount + fee);      
        return true;
    }
}