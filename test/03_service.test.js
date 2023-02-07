import assert from 'assert'
import { 
  setCurrentPrice 
} from "../src/exchange/binance.js";
import { Service } from '../src/manage/service.js'
import { Account } from '../src/user/account.js';
import { BUY_SELL } from '../src/type.js';

let service;
let user1, user2;
const symbol = "ethusdt@trade";
const buy_min = 2000;
const buy_max = 2020;
const targets = [2030, 2045, 2070];
const stoploss = 1980;

describe('test Service', () => {

  before(() => {
    setCurrentPrice(1600);
    user1 = new Account();
    user2 = new Account();
  });

  it('create new service and user1 deposit 1500USDT and user2 deposit 2000USDT', () => {
    service = new Service();
    const buyrange = service.getbuyRange();
    assert.equal(0, service.getSymbol());
    assert.equal(0, service.buyMin);
    assert.equal(0, service.buyMax);

    user1.deposit(1500);
    user2.deposit(2000);
  });

  it('set configuration', () => {
    service.setConfiguration(symbol, buy_min, buy_max);
    assert.equal(symbol, service.getSymbol());
    assert.equal(buy_min, service.buyMin);
    assert.equal(buy_max, service.buyMax);
  });

  it('set strategy settings', () => {
    service.setStrategyTargets(targets, stoploss);
    assert.equal(stoploss, service.sSignal.getStopLoss());
  });

  it('add account to this service', () => {
    const res1 = service.addAccount(user1);
    assert.equal('OUT OF BUY PRICE RANGE', res1);
    setCurrentPrice(2012);
    const res2 = service.addAccount(user1);
    assert.equal('SUCCESS', res2);
    assert.equal(1, service.accounts.length);
    service.addAccount(user2);
    assert.equal(1, service.accounts[1].getPositions().length);
  });

  describe('test logic process', () => {
    it('hit target1', async() => {
      const beforeuser1PositionsCnt = user1.getPositions().length;
      const beforeuser2PositionsCnt = user2.getPositions().length;
      const beforeETHBablance1 = user1.getETHBalance();
      const beforeETHBablance2 = user2.getETHBalance();

      setCurrentPrice(2040);
      service.doProcess(2040, service);
      const user1Positions = user1.getPositions();
      const user2Positions = user2.getPositions();

      assert.equal(beforeuser1PositionsCnt + 1, user1Positions.length);
      assert.equal(BUY_SELL.SELL, user1Positions[user1Positions.length - 1].buySell);
      assert.equal(beforeETHBablance1 * 1 / service.sSignal.getTargetsCount(), user1Positions[user1Positions.length - 1].ethAmount);
      assert.equal(beforeuser2PositionsCnt + 1, user2Positions.length);
      assert.equal(BUY_SELL.SELL, user2Positions[user2Positions.length - 1].buySell);
      assert.equal(beforeETHBablance2 * 1 / service.sSignal.getTargetsCount(), user2Positions[user2Positions.length - 1].ethAmount);
    });

    it('hit target1 continously', async() => {
      const beforeuser1PositionsCnt = user1.getPositions().length;
      const beforeuser2PositionsCnt = user2.getPositions().length;
      const beforeETHBablance1 = user1.getETHBalance();
      const beforeETHBablance2 = user2.getETHBalance();

      setCurrentPrice(2040);
      service.doProcess(2040, service);
      const user1Positions = user1.getPositions();
      const user2Positions = user2.getPositions();

      assert.equal(beforeuser1PositionsCnt, user1Positions.length);
      assert.equal(beforeuser2PositionsCnt, user2Positions.length);
    });    

    it('hit target1 two times', async() => {
      const beforeuser1PositionsCnt = user1.getPositions().length;
      const beforeuser2PositionsCnt = user2.getPositions().length;

      setCurrentPrice(2020);
      service.doProcess(2020, service);
      const user1Positions = user1.getPositions();
      const user2Positions = user2.getPositions();

      assert.equal(beforeuser1PositionsCnt, user1Positions.length);
      assert.equal(beforeuser2PositionsCnt, user2Positions.length);
      
      setCurrentPrice(2040);
      service.doProcess(2040, service);
      const afteruser1Positions = user1.getPositions();
      const afteruser2Positions = user2.getPositions();
      
      assert.equal(beforeuser1PositionsCnt, afteruser1Positions.length);
      assert.equal(beforeuser2PositionsCnt, afteruser2Positions.length);
    });    

    it('hit target3 and target2 at same time', () => {
      const beforeuser1PositionsCnt = user1.getPositions().length;
      const beforeuser2PositionsCnt = user2.getPositions().length;
      const beforeETHBablance1 = user1.getETHBalance();
      const beforeETHBablance2 = user2.getETHBalance();

      setCurrentPrice(3000);
      service.doProcess(3000, service);
      const user1Positions = user1.getPositions();
      const user2Positions = user2.getPositions();
      const afterETHBablance1 = user1.getETHBalance();
      const afterETHBablance2 = user2.getETHBalance();

      assert.equal(beforeuser1PositionsCnt + 1, user1Positions.length);
      assert.equal(BUY_SELL.SELL, user1Positions[user1Positions.length - 1].buySell);
      assert.equal(beforeETHBablance1, user1Positions[user1Positions.length - 1].ethAmount);
      assert.equal(beforeuser2PositionsCnt + 1, user2Positions.length);
      assert.equal(BUY_SELL.SELL, user2Positions[user2Positions.length - 1].buySell);
      assert.equal(beforeETHBablance2, user2Positions[user2Positions.length - 1].ethAmount);
      assert.equal(0, afterETHBablance1);
      assert.equal(0, afterETHBablance2);
    });
  });

});