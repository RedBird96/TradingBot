import { Service } from "./src/manage/service.js";
import { Account } from "./src/user/account.js";

const SYMBOL = 'ethusdt@trade'; //define symbol name for trading example, we can change this for using another symbol
const BUY_MIN = 2000; //lowest buy price
const BUY_MAX = 2020; //highest buy price

const user1 = new Account();
const user2 = new Account();
const user3 = new Account();
const service = new Service();

service.setConfiguration(SYMBOL, BUY_MIN, BUY_MAX);
service.setStrategyTargets([2030, 2035, 2036], 1980);
service.addAccount(user1);
service.addAccount(user2);
service.addAccount(user3);

service.start();
