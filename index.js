var _ = require('lodash')
  , cheerio = require('cheerio')
  , request = require('request');

module.exports = function (settings) {
  settings = _.defaults(settings || {}, {

  });

  return {
    search: function (options) {
      settings = _.defaults(options || {}, {

      });
    }
  };
};