// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MultiPay {
    function payAmountToManyAddresses(address payable[] memory addresses, uint256 amount) public payable {
        require(msg.value >= amount * addresses.length);
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            addresses[k].transfer(amount);
            paid += amount;
        }
        
        if (paid < msg.value)
            msg.sender.transfer(msg.value - paid);
    }
    
    function payManyAmountsToManyAddresses(address payable[] memory addresses, uint256[] memory amounts) public payable {
        require(addresses.length == amounts.length);
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            addresses[k].transfer(amounts[k]);
            paid += amounts[k];
        }
        
        if (paid < msg.value)
            msg.sender.transfer(msg.value - paid);
    }
    
    function payTokenAmountToManyAddresses(ERC20 token, uint256 totalAmount, address[] memory addresses, uint256 amount) public {
        require(totalAmount >= amount * addresses.length, "not enough amount available");   
        require(token.transferFrom(msg.sender, address(this), totalAmount), "cannot transfer tokens from sender");
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            token.transfer(addresses[k], amount);
            paid += amount;
        }
        
        if (paid < totalAmount)
            token.transfer(msg.sender, totalAmount - paid);
    }
    
    function payTokenManyAmountsToManyAddresses(ERC20 token, uint256 totalAmount, address[] memory addresses, uint256[] memory amounts) public {
        require(token.transferFrom(msg.sender, address(this), totalAmount), "cannot transfer tokens from sender");
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            token.transfer(addresses[k], amounts[k]);
            paid += amounts[k];
        }
        
        if (paid < totalAmount)
            token.transfer(msg.sender, totalAmount - paid);
    }
}
