import assert from 'assert'
import { Account } from '../src/user/account.js';
import { 
  currentPrice, 
  setCurrentPrice 
} from "../src/exchange/binance.js";
import {BUY_SELL} from '../src/type.js'

const USDTAmount1 = 2000;
const USDTAmount2 = 3000;
let user1;
let user2;
let user3;
const sellETHAmount1 = 0.3;
const sellETHAmount2 = 0.5;
describe('test account', () => {

  before(() => {
    setCurrentPrice(1600);
  });

  it('create user1 and user2', () => {
    user1 = new Account();
    user2 = new Account();
    user3 = new Account();
    assert.equal(0, user1.getUSDTAmount());
    assert.equal(0, user1.getETHBalance());
    assert.equal(0, user1.getTargetIndex());

    assert.equal(0, user2.getUSDTAmount());
    assert.equal(0, user2.getETHBalance());
    assert.equal(0, user2.getTargetIndex());
  });

  it('deposit user1', () => {
    user1.deposit(0);
    assert.equal(0, user1.getUSDTAmount());
    user1.deposit(USDTAmount1);
    assert.equal(USDTAmount1, user1.getUSDTAmount());
    user2.deposit(USDTAmount1);
    user2.deposit(USDTAmount2);
    assert.equal(USDTAmount1 + USDTAmount2, user2.getUSDTAmount());
  });

  it('buy ETH token', () => {
    const res1 = user3.buyETH();
    assert.equal("DEPOSIT BEFORE BUY", res1);
    const res2 = user1.buyETH();
    const position = user1.getPositions();
    assert.equal("SUCCESS", res2);
    assert.equal(USDTAmount1 / currentPrice, user1.getETHBalance());
    assert.equal(BUY_SELL.BUY, position[0].buySell);
    assert.equal(USDTAmount1 / currentPrice, position[0].ethAmount);
    assert.equal(USDTAmount1, position[0].usdtAmount);
    assert.equal(0, user1.getUSDTAmount());
    const res3 = user2.buyETH();
  });

  it('sell ETH token to buy USDT', () => {
    const beforeETH = user1.getETHBalance();
    const beforepositions = user1.getPositions();
    const beforepositions_len = beforepositions.length;
    const res1 = user1.sellETH(100);
    setCurrentPrice(1800);
    assert.equal("ETHEREUM BALANCE INSUFFICIENT", res1);
    const res2 = user1.sellETH(sellETHAmount1);
    const positions = user1.getPositions();
    assert.equal("SUCCESS", res2);
    assert.equal(beforeETH - sellETHAmount1, user1.getETHBalance());
    assert.equal(sellETHAmount1 * 1800, user1.getUSDTAmount());
    assert.equal(beforepositions_len + 1, positions.length);
    assert.equal(BUY_SELL.SELL, positions[positions.length - 1].buySell);
    const res3 = user1.sellETH(sellETHAmount2);
    const afterpositions = user1.getPositions();
    assert.equal(BUY_SELL.SELL, afterpositions[afterpositions.length - 1].buySell);
    assert.equal(3, afterpositions.length);
  })
})