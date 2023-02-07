import { SignalStrategy } from "../strategy/signals.js";
import {subscribe, currentPrice} from "../exchange/binance.js"
import { STATUS } from "../type.js";

class Service {

  symbol; //symbol name
  buyMin; //buy lowest price
  buyMax; //buy highest price
  sSignal; //Signal Strategy object
  accounts; //users array

  constructor() {
    this.symbol = '';
    this.buyMin = 0;
    this.buyMax = 0;
    this.sSignal = new SignalStrategy();
    this.accounts = new Array();
  }

  /**
   * @return {object} - return symbol
   */
  getSymbol() {
    return this.symbol;
  }

  /**
   * 
   * @returns {object} return buy price range
   */
  getbuyRange() {
    return [this.buyMin, this.buyMax];
  }
  

  /***
   * Called when owner want to set configuration such as symbol and buy range
   * @param {object} _symbol - symbol name
   * @param {object} _buyMin - lowest buy price
   * @param {object} _buyMax - highest buy price
   */
  setConfiguration(_symbol, _buyMin, _buyMax) {
    this.symbol = _symbol;
    this.buyMin = _buyMin;
    this.buyMax = _buyMax;
  }

  /***
   * Called when owner want to set target prices and stoploss price
   * @param {object} _targets - target prices
   * @param {object} _stopLoss - stoploss price
   */
  setStrategyTargets(_targets, _stopLoss) {
    this.sSignal.setTargets(_targets, _stopLoss);
  }

  /***
   * Called when owner add the account
   * @param {object} _account - new user account  to add to this service
   * @return {STATUS} - return adding account result
   */
  addAccount(_account) {
    if (currentPrice < this.buyMin || currentPrice > this.buyMax)
      return STATUS.OUT_OF_BUYRANGE;

    const res = _account.buyETH();
    if (res == STATUS.OK) 
      this.accounts.push(_account);

    return res;
  }

  /***
   * Called when the price update
   * This function is main to execute the signal
   * @param {object} data - new price
   * @param {object} object - this object
   */
  doProcess(data, object) {

    //check if this new price hit target
    const targetIndex = object.sSignal.checkSignal(data);
    if (targetIndex != 0) {

      //calculate profit percentages according target
      const target = object.sSignal.getTargets();
      const calcPercent = (target[targetIndex - 1] / object.buyMin) - 1.00;

      //sell process for all accounts
      object.accounts.forEach((value) => {
        let sellAmount = 0;
        const ethBal = value.getETHBalance();
        if (targetIndex == -1){ //if it's stoploss, sell all eth amounts
          sellAmount = ethBal;
        } else {
          //sell only when the target is higher then user's reached target
          if (value.targetIndex >= targetIndex)
            return;

          //calculate percentage to sell
          //ex: if the target count 4, each target has 25%
          const count = object.sSignal.getTargetsCount();
          const sellPercent = 1 / count * targetIndex;
          sellAmount = ethBal * sellPercent;
        }
        //update user's target when the sell is successed
        const res = value.sellETH(sellAmount);
        if (res == STATUS.OK)
          value.setTargetIndex(targetIndex);
      });
    }

  }

  /**
   * Start the service
   */
  start() {
    subscribe(this.doProcess, this);
  }

}

export {Service}