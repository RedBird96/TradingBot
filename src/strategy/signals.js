//Signal Strategy class
class SignalStrategy {

  targets;  //target array
  targetsCount; //target count
  stopLoss; //stopLoss price
  prePrice; //previous price

  constructor() {
    this.targets = new Array();
    this.prePrice = 0;
    this.stopLoss = 0;
    this.targetsCount = 0;
  }

  /***
   * @return {object} stoploss price
   */
  getStopLoss() {
    return this.stopLoss;
  }

  /**
   * 
   * @returns {object} target array
   */
  getTargets() {
    return this.targets;
  }

  /**
   * 
   * @returns {object} targetCount
   */
  getTargetsCount() {
    return this.targetsCount;
  }

  /**
   * @returns {object} return previous price
   */
  getPreviousPrice() {
    return this.prePrice;
  }
  /**
   * set targets and stoploss price
   * @param {object} _targets - targets signal parameter
   * @param {object} _stopLoss - stoploss parameter
   */
  setTargets(_targets, _stopLoss) {
    this.targets = _targets;
    this.stopLoss = _stopLoss;
    this.targetsCount = _targets.length;
  }

  /**
   * Called when new price is arrived
   * @param {object} price - calculate price
   * @returns  0 - not found signal
   *          -1 - stoploss signal
   *          >0 - hit target index 
   */
  checkSignal(price) {

    let foundTargetInd = 0;
    //return 0 if the price is not updated with old price
    if (price == this.prePrice)
      return 0;

    //return -1 if the signal is stoploss
    if (price <= this.stopLoss) 
      return -1;

    //find the last target index
    for (let i = 0 ; i < this.targets.length; i ++) {
      if (price >= this.targets[i]) {
        foundTargetInd = i + 1;
      }
    }

    //update previous price to check new price validation
    this.prePrice = price;

    return foundTargetInd;
  }

}

export {SignalStrategy}