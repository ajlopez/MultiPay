
const MultiPay = artifacts.require('MultiPay');
const BasicToken = artifacts.require('BasicToken');

const expectThrow = require('./utils').expectThrow;

contract('MultiPay', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];
    
    describe('pay crypto many accounts one repeated amount', function () {
        let multiPay;
        
        beforeEach(async function () {
            multiPay = await MultiPay.new();
        });
        
        it('cannot transfer value to contract', async function () {
            expectThrow(web3.eth.sendTransaction({ from: alice, to: multiPay.address, value: 10000000 }));   
        });
    
        it('pay to two accounts', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            await multiPay.payAmountToManyAddresses([bob, charlie], 1000000, { value: 2000000 });
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 1000000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 1000000);
        });
    
        it('pay to two accounts with too much value', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            await multiPay.payAmountToManyAddresses([bob, charlie], 1000000, { value: 3000000 });
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 1000000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 1000000);
            
            const contractBalance = Number(await web3.eth.getBalance(multiPay.address));
            
            assert.equal(contractBalance, 0);
        });
        
        it('pay to two accounts without enough value', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            expectThrow(multiPay.payAmountToManyAddresses([bob, charlie], 1000000, { value: 1800000 }));
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance);
            assert.equal(finalCharlieBalance, initialCharlieBalance);
        });
    });
    
    describe('pay crypto many accounts many amounts', function () {
        let multiPay;
        
        beforeEach(async function () {
            multiPay = await MultiPay.new();
        });
    
        it('pay to two accounts', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            await multiPay.payManyAmountsToManyAddresses([bob, charlie], [ 1000000, 2000000 ], { value: 3000000 });
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 1000000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 2000000);
        });
    
        it('pay to two accounts with too much value', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            await multiPay.payManyAmountsToManyAddresses([bob, charlie], [ 1000000, 2000000 ], { value: 4000000 });
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 1000000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 2000000);
            
            const contractBalance = Number(await web3.eth.getBalance(multiPay.address));
            
            assert.equal(contractBalance, 0);
        });
        
        it('pay to two accounts without enough value', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            expectThrow(multiPay.payManyAmountsToManyAddresses([bob, charlie], [1000000, 2000000], { value: 2000000 }));
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance);
            assert.equal(finalCharlieBalance, initialCharlieBalance);
        });
        
        it('pay three amounts to two accounts', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            expectThrow(multiPay.payManyAmountsToManyAddresses([bob, charlie], [1000000, 2000000, 3000000], { value: 10000000 }));
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance);
            assert.equal(finalCharlieBalance, initialCharlieBalance);
        });
    });

    describe('pay token amount to many addresses', function () {
        let multiPay;
        let token;
        
        beforeEach(async function () {
            multiPay = await MultiPay.new();
            token = await BasicToken.new('Token', 'TOK');
            await token.approve(multiPay.address, 2000000);
        });
    
        it('pay tokens to two accounts', async function () {
            const initialBobBalance = Number(await token.balanceOf(bob));
            const initialCharlieBalance = Number(await token.balanceOf(charlie));
            
            await multiPay.payTokenAmountToManyAddresses(token.address, 2000000, [bob, charlie], 1000000);
            
            const finalBobBalance = Number(await token.balanceOf(bob));
            const finalCharlieBalance = Number(await token.balanceOf(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 1000000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 1000000);
        });
    
        it('pay to two accounts with too much value', async function () {
            const initialAliceBalance = Number(await token.balanceOf(alice));
            const initialBobBalance = Number(await token.balanceOf(bob));
            const initialCharlieBalance = Number(await token.balanceOf(charlie));
            
            await multiPay.payTokenAmountToManyAddresses(token.address, 2000000, [bob, charlie], 800000);
            
            const finalAliceBalance = Number(await token.balanceOf(alice));
            const finalBobBalance = Number(await token.balanceOf(bob));
            const finalCharlieBalance = Number(await token.balanceOf(charlie));
            
            assert.equal(finalAliceBalance, initialAliceBalance - 1600000);
            assert.equal(finalBobBalance, initialBobBalance + 800000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 800000);
            
            const contractBalance = Number(await web3.eth.getBalance(multiPay.address));
            
            assert.equal(contractBalance, 0);
        });
        
        it('pay to two accounts without enough token approved value', async function () {
            const initialBobBalance = Number(await token.balanceOf(bob));
            const initialCharlieBalance = Number(await token.balanceOf(charlie));
            
            expectThrow(multiPay.payTokenAmountToManyAddresses(token.address, 2200000, [bob, charlie], 1100000));
            
            const finalBobBalance = Number(await token.balanceOf(bob));
            const finalCharlieBalance = Number(await token.balanceOf(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance);
            assert.equal(finalCharlieBalance, initialCharlieBalance);
        });
    });
    
    describe('pay tokens many accounts many amounts', function () {
        let multiPay;
        let token;
        
        beforeEach(async function () {
            multiPay = await MultiPay.new();
            token = await BasicToken.new('Token', 'TOK');
            await token.approve(multiPay.address, 2000000);
        });
    
        it('pay tokens to two accounts', async function () {
            const initialBobBalance = Number(await token.balanceOf(bob));
            const initialCharlieBalance = Number(await token.balanceOf(charlie));
            
            await multiPay.payTokenManyAmountsToManyAddresses(token.address, 2000000, [bob, charlie], [ 800000, 1200000 ]);
            
            const finalBobBalance = Number(await token.balanceOf(bob));
            const finalCharlieBalance = Number(await token.balanceOf(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 800000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 1200000);
        });
    
        it('pay tokens to two accounts with too much token value', async function () {
            const initialBobBalance = Number(await token.balanceOf(bob));
            const initialCharlieBalance = Number(await token.balanceOf(charlie));
            
            await multiPay.payTokenManyAmountsToManyAddresses(token.address, 2000000, [bob, charlie], [ 800000, 800000 ]);
            
            const finalBobBalance = Number(await token.balanceOf(bob));
            const finalCharlieBalance = Number(await token.balanceOf(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance + 800000);
            assert.equal(finalCharlieBalance, initialCharlieBalance + 800000);
            
            const contractBalance = Number(await token.balanceOf(multiPay.address));
            
            assert.equal(contractBalance, 0);
        });
        
        it('pay to two accounts without enough value', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            expectThrow(multiPay.payTokenManyAmountsToManyAddresses(token.address, 2000000, [bob, charlie], [1000000, 2000000]));
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance);
            assert.equal(finalCharlieBalance, initialCharlieBalance);
        });
        
        it('pay three amounts to two accounts', async function () {
            const initialBobBalance = Number(await web3.eth.getBalance(bob));
            const initialCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            expectThrow(multiPay.payTokenManyAmountsToManyAddresses(token.address, 2000000, [bob, charlie], [100000, 200000, 300000]));
            
            const finalBobBalance = Number(await web3.eth.getBalance(bob));
            const finalCharlieBalance = Number(await web3.eth.getBalance(charlie));
            
            assert.equal(finalBobBalance, initialBobBalance);
            assert.equal(finalCharlieBalance, initialCharlieBalance);
        });
    });
});

