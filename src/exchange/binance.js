import { WebSocket } from 'ws';

let binance_ws = 'wss://stream.binance.com:9443/ws/';
let ws = null;
const symbol = "ethusdt@trade";
export let currentPrice = 0;
/**
* Called when socket is opened
* @return {undefined}
 */
const handleSocketOpen = function () {
  this.isAlive = true;
  const ti = new Date().toLocaleString();;
  // socketHeartbeatInterval = setInterval( socketHeartbeat, 30000 );
};

/**
* Called when socket is closed
* @return {undefined}
 */
const handleSocketClose = function () {
  this.isAlive = false;
  ws = new WebSocket(binance_ws + symbol);
};

/**
* Called when socket errors
* @param {object} error - error object message
* @return {undefined}
 */
const handleSocketError = function ( error ) {
  /* Errors ultimately result in a `close` event. */
  console.log( 'WebSocket error: ' + this.endpoint +
        ( error.code ? ' (' + error.code + ')' : '' ) +
        ( error.message ? ' ' + error.message : '' ) );
};

/**
 * Called from unit test
 * @param {object} price 
 */
export const setCurrentPrice = function (price) {
  currentPrice = price;
}
/***
 * Use to subscribe to a single websocket endpoint
 * @param {function} callback - the function to call when data is received
 */
const subscribe = function(callback, object) {

  ws = new WebSocket(binance_ws + symbol);
  ws.onopen = handleSocketOpen;
  ws.onclose = handleSocketClose;
  ws.onerror = handleSocketError;
  ws.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    currentPrice = stockObject.p;
    callback(stockObject.p, object);
  }

}

export {subscribe}