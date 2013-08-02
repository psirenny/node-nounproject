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

exports.icon = function (option, callback) {
  if (!options.id) return callback('id required');
  if (!options.noun) return callback('noun required');

  request(exports.url(options) + '/noun/' + options.name + '#icon-No' + options.id, function (err, res, body) {
    // implement
  });
};

exports.named = function (options, callback) {
  if (!options.name) return callback('name required');

  request(exports.url(options) + '/noun/' + options.name, function (err, res, body) {
    if (err) return callback(err);
    var $ = cheerio.load(body);
    $('#other-icons .uploadYourOwn').remove();
    var ids = $('#other-icons li.icon').map(function (i, el) { return $(el).attr('id').match(/otherIcon-(\d+)/)[1]; });
    callback(null, ids);
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

exports.tagged = function (options, callback) {
  if (!options.tag) return callback('tag required');

  request(exports.url(options) + '/tag/' + options.tag, function (err, res, body) {
    if (err) return callback(err);
    var $ = cheerio.load(body);
    callback(null, $('#tags h5 a').map(function (i, el) { return $(el).text(); }));
  });
};

exports.url = function (options) {
  options = _.defaults(options || {}, {
    language: 'en-us',
  });

  return 'http://thenounproject.com/' + options.language.toLowerCase();
};