//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract Transactions {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public wid;

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;

        _status = _NOT_ENTERED;
    }

    constructor() {
        _status = _NOT_ENTERED;
    }

    // deposit funds into the escrow account
    // accepts an address that receives the funds, and increments the payee's wallet by the amount
    function deposit(
        address payee,
        address owner,
        uint256 amount
    ) public payable {
        uint256 amountPerc = (amount * 1) / 100;

        deposits[payee] = deposits[payee] + amount - amountPerc;
        wid[owner] = wid[owner] + amountPerc;
    }

    // withdraws the funds into the payee address
    function withdraw(address payee, address owner) public nonReentrant {
        uint256 payment = deposits[payee];
        uint256 ownerPayment = wid[owner];

        require(payment > 0);
        require(ownerPayment > 0);

        deposits[payee] = 0;
        payable(payee).transfer(payment);

        wid[owner] = 0;
        payable(owner).transfer(ownerPayment);
    }

    function transact(address payee, address owner) public payable {
        deposit(payee, owner, msg.value);
        withdraw(payee, owner);
    }
}
