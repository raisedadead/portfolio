"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHelloString = getHelloString;

exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: getHelloString()
  });
};

function getHelloString() {
  return JSON.stringify({
    message: `Hello, World! (And now a random number to prove this is dynamically generated: ` + Math.round(Math.random() * 10) + `).`
  });
}