const withTM = require('next-transpile-modules')(['react-markdown',"react-syntax-highlighter"]);

module.exports = withTM({
  reactStrictMode: true
});