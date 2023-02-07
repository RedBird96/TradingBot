import { BUY_SELL, STATUS } from "../type.js";
import { currentPrice } from "../exchange/binance.js";

//Account class
class Account {
  depositAmount; //USDT amount
  ethBalance; //ETH amount
  positions;  //position list
  targetIndex;  //target index which the account reached

  constructor() {
    this.depositAmount = 0;
    this.ethBalance = 0;
    this.positions = new Array();
    this.targetIndex = 0;
  }

  /**
   * 
   * @returns - deposited USDT amount
   */
  getUSDTAmount() {
    return this.depositAmount;
  }

  /**
   * 
   * @returns return ETH balance
   */
  getETHBalance() {
    return this.ethBalance;
  }

  /**
   * 
   * @returns return ETH balance
   */
   getPositions() {
    return this.positions;
  }

  /**
   * 
   * @returns return reached target index
   */
  getTargetIndex() {
    return this.targetIndex;
  }

  /**
   * 
   * @param {object} _targetInd - new target index to keep
   */
  setTargetIndex(_targetInd) {
    this.targetIndex = _targetInd;
  }

  /**
   * 
   * @param {object} amount - USDT deposit amount
   */
  deposit(amount) {
    if (amount > 0)
      this.depositAmount += amount;
  }

  /**
   * 
   * @returns - the result for buy ETH and create buy position
   */
  buyETH() {
    if (this.depositAmount == 0) {
      return STATUS.DEPOSIT_FIRST;
    }
    this.ethBalance = this.depositAmount / currentPrice;
    this.positions.push({
      ethAmount: this.ethBalance,
      usdtAmount: this.depositAmount,
      buySell: BUY_SELL.BUY
    });
    this.depositAmount = 0;
    return STATUS.OK;
  }

  /**
   * 
   * @param {object} amount - sell ETH amount to buy USDT
   * @returns - sell ETH and create sell position
   */
  sellETH(amount) {
    if (amount > this.ethBalance) {
      return STATUS.INSUFFICIENT;
    }
    const plusAmount = amount * currentPrice;
    this.depositAmount += plusAmount;
    this.positions.push({
      ethAmount: amount,
      usdtAmount: plusAmount,
      buySell: BUY_SELL.SELL
    });
    this.ethBalance -= amount;    
    return STATUS.OK;
  }

}

export {Account}