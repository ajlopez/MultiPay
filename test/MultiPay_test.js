
const MultiPay = artifacts.require('MultiPay');

contract('MultiPay', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];
    
    describe('pay crypto', function () {
        let multiPay;
        
        beforeEach(async function () {
            multiPay = await MultiPay.new();
        });
        
        it('pay to two accounts', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            await multiPay.payToMany([bob, charlie], 1000000, { value: 2000000 });
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 1000000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 1000000);
        });
    });
});

