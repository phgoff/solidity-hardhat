//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;
    bool internal locked;

    mapping ( address => uint) public balances;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    modifier noReentrant() {
        require(!locked, "No re-entracy");
        locked = true;
        _;
        locked = false;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external payable noReentrant{
        uint balance = balances[msg.sender];
        require(balance > 0, "Not enough balances");
        balances[msg.sender] = 0;

        bool sent = payable(msg.sender).send(balance);
        require(sent, "Failed to send");
    }

    function withdrawAmount(address payable _to, uint _amount) external payable noReentrant{
        uint balance = balances[msg.sender];
        require(balance >= _amount, "Not enough balances");

        // to prevent reentrancy, changes state before calling external contract
        balances[msg.sender] -= _amount;

        (bool sent,) = _to.call{ value: _amount}("");
        require(sent, "Failed to send");
    }

    function getBalance() external view returns (uint) {
        return balances[msg.sender];
    }

    function balanceOf() external view returns (uint) {
        return address(this).balance;
    }

}
