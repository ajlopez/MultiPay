pragma solidity ^0.6.0;

contract MultiPay {
    function payToMany(address payable[] memory addresses, uint256 amount) public payable {
        for (uint256 k = 0; k < addresses.length; k++)
            addresses[k].transfer(amount);
    }
}
