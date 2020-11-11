// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MultiPay {
    bool processing;
    
    function payAmountToManyAddresses(address payable[] memory addresses, uint256 amount) public payable {
        require(!processing);
        require(msg.value >= amount * addresses.length);
        
        processing = true;
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            addresses[k].transfer(amount);
            paid += amount;
        }
        
        if (paid < msg.value)
            msg.sender.transfer(msg.value - paid);
            
        processing = false;
    }
    
    function payManyAmountsToManyAddresses(address payable[] memory addresses, uint256[] memory amounts) public payable {
        require(!processing);
        require(addresses.length == amounts.length);
        
        processing = true;
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            addresses[k].transfer(amounts[k]);
            paid += amounts[k];
        }
        
        if (paid < msg.value)
            msg.sender.transfer(msg.value - paid);
            
        processing = false;
    }
    
    function payTokenAmountToManyAddresses(ERC20 token, uint256 totalAmount, address[] memory addresses, uint256 amount) public {
        require(!processing);
        require(totalAmount >= amount * addresses.length, "not enough amount available");   
        require(token.transferFrom(msg.sender, address(this), totalAmount), "cannot transfer tokens from sender");
        
        processing = true;
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            token.transfer(addresses[k], amount);
            paid += amount;
        }
        
        if (paid < totalAmount)
            token.transfer(msg.sender, totalAmount - paid);
            
        processing = false;
    }
    
    function payTokenManyAmountsToManyAddresses(ERC20 token, uint256 totalAmount, address[] memory addresses, uint256[] memory amounts) public {
        require(!processing);
        require(token.transferFrom(msg.sender, address(this), totalAmount), "cannot transfer tokens from sender");

        processing = true;
        
        uint256 paid = 0;
        
        for (uint256 k = 0; k < addresses.length; k++) {
            token.transfer(addresses[k], amounts[k]);
            paid += amounts[k];
        }
        
        if (paid < totalAmount)
            token.transfer(msg.sender, totalAmount - paid);
            
        processing = false;
    }
}
