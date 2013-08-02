var _ = require('lodash')
  , cheerio = require('cheerio')
  , request = require('request');

exports.categories = function (options, callback) {
  request(this.url(options) + '/categories', function (err, res, body) {
    if (err) return callback(err);
    var $ = cheerio.load(body);
    callback(null, $('#categories h3').map(function (i, el) {
      $(el).find('span').last().remove();
      return {
        count: $(el).find('span').text().replace(/[^0-9]/g, ''),
        name: $(el).text().replace(/[\n()0-9]/g, '').trim()
      };
    }));
  });
};

exports.collections = function (options, callback) {
  request(this.url(options) + '/collections', function (err, res, body) {
    if (err) return callback(err);
    var $ = cheerio.load(body);
    var $names = $('#collections h3');
    $names.find('span').remove();
    callback(null, $names.map(function (i, el) { return $(el).text().trim(); }));
  });
};

exports.search = function (options, callback) {
  if (!options.query) return callback('query required');

  request(this.url(options) + '/search/?q=' + options.query, function (err, res, body) {
    if (err) return callback(err);
    var $ = cheerio.load(body);

    var parseNoun = function (i, el) {
      $(el).find('span').remove();
      return {
        count: $(el).find('em').text().replace(/[^0-9]/g, ''),
        name: $(el).text().replace(/[\n()0-9]/g, '').trim()
      };
    };

    callback(null, {
      count: $('.net-results', '#search-results').text().replace(/[^0-9]/g, ''),
      nouns: {
        exact: $('a', '#noun-exact-matches').map(parseNoun),
        include: $('a', '#noun-nonexact-matches').map(parseNoun)
      },
      tags: $('a', '#tag-matches').map(function (i, el) { return $(el).text(); })
    });
  });
};

exports.tags = function (options, callback) {
  if (!options.tag) return callback('tag required');

  request(this.url(options) + '/tag/' + options.tag, function (err, res, body) {
    if (err) return callback(err);
    var $ = cheerio.load(body);
    var tags = $('#tags h5 a').map(function (i, el) {
      return {
        id: $(el).attr('href').match(/-No(\d+)/)[1],
        name: $(el).text()
      }
    });
    callback(null, tags);
  });
};

exports.url = function (options) {
  options = _.defaults(options || {}, {
    language: 'en-us',
  });

  return 'http://thenounproject.com/' + options.language.toLowerCase();
};