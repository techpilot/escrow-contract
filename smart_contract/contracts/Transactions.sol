//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract Transactions {
    address agent;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public wid;

    modifier onlyAgent() {
        require(msg.sender == agent);
        _;
    }

    constructor() {
        agent = msg.sender;
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
    function withdraw(address payee, address owner) public {
        uint256 payment = deposits[payee];
        uint256 ownerPayment = wid[owner];

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
