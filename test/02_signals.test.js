import assert from 'assert'
import {SignalStrategy} from '../src/strategy/signals.js'

let sSignalMocha;
const test_TargetArray = [1000, 2000, 3000];
const test_stopLoss = 700;

describe('test Signal Strategy', () => {
  
  it('create Signal object', () => {
    sSignalMocha = new SignalStrategy();
    const targets = sSignalMocha.getTargets();
    const targetsCount = sSignalMocha.getTargetsCount();
    const stopLoss = sSignalMocha.getStopLoss();
    const prePrice = sSignalMocha.getPreviousPrice();
    assert.equal(0, targets.length);
    assert.equal(0, targetsCount);
    assert.equal(0, stopLoss);
    assert.equal(0, prePrice);
  });

  it('set targets', () => {
    
    sSignalMocha.setTargets(test_TargetArray, test_stopLoss);
    const targets = sSignalMocha.getTargets();
    const targetsCount = sSignalMocha.getTargetsCount();
    const stopLoss = sSignalMocha.getStopLoss();
    assert.equal(test_TargetArray,targets);
    assert.equal(3, targetsCount);
    assert.equal(test_stopLoss, stopLoss);
  });

  it('check non signal', () => {
    const res1 = sSignalMocha.checkSignal(800);
    const previous = sSignalMocha.getPreviousPrice();
    assert.equal(0, res1);
    assert.equal(800, previous);
    const res2 = sSignalMocha.checkSignal(800);
    assert.equal(0, res2);
  });

  it('check stoploss signal', () => {
    const res1 = sSignalMocha.checkSignal(700);
    assert.equal(-1, res1);
  })

  it('check target signal', () => {
    const res1 = sSignalMocha.checkSignal(1500);
    assert.equal(1, res1);
    const res2 = sSignalMocha.checkSignal(2500);
    assert.equal(2, res2);
    const res3 = sSignalMocha.checkSignal(3500);
    assert.equal(3, res3);
  })
});

