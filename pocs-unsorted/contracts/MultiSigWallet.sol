//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";

contract MultiSigWallet {

    struct Transaction {
        uint amount;
        address from;
        address payable to;
        uint8 signatureCount;
        bool sent;
        mapping(address => bool) signatures;
    }

    Counters.Counter private  _idCounter;
    uint8 private _minSigners;
    mapping(address => bool) private _owners;  
    mapping(uint => Transaction) private _transactions;

    event TransactionCreated(uint, address, uint);
    event TransactionExecuted(uint, address, uint);
    event DepositedEther(uint);

    constructor(uint8 minSigners) {
        _minSigners = minSigners;
        _owners[msg.sender] = true;
    }

    function isOwner() external view returns(bool){
        return _owners[msg.sender];
    }

    function addOwner(address additionalOwner) external {
        require(_owners[msg.sender], "You are not allowed to add owners");
        _owners[additionalOwner] = true;
    }

    function removeOwner(address ownerToRemove) external {
        require(msg.sender != ownerToRemove, "You can't remove onwership from yourself");
        _owners[ownerToRemove] = false;
    }

    function createTransaction(address payable to, uint amount) external {
        require(_owners[msg.sender], "You are not owner");

        Counters.increment(_idCounter);
        uint transactionId = Counters.current(_idCounter);

        Transaction storage newTransaction = _transactions[transactionId];
        newTransaction.from = msg.sender;
        newTransaction.to = to;
        newTransaction.amount = amount;
        _signTransaction(transactionId);

        emit TransactionCreated(transactionId, to, amount);
    }


    function signTransaction(uint transactionId) external {
        require(_owners[msg.sender], "You are not onwer");
        require(!_transactions[transactionId].sent, "Transaction is sent");

        uint amount = _transactions[transactionId].amount;
        require(amount != 0, "Transaction is empty");

        _signTransaction(transactionId);

        uint8 signatureCount = _transactions[transactionId].signatureCount;
        address payable to = _transactions[transactionId].to;
        
        if (signatureCount >= _minSigners) {
            to.transfer(amount);

            _transactions[transactionId].sent = true;
            emit TransactionExecuted(transactionId, to, amount);
        }
    }

    function getTransactionAmount(uint transactionId) external view returns(uint){
        return _transactions[transactionId].amount;
    }

    function _signTransaction(uint transactionId) internal {
        _transactions[transactionId].signatures[msg.sender] = true;
        _transactions[transactionId].signatureCount++;
    }

    receive() external payable {
        emit DepositedEther(msg.value);
    }
}