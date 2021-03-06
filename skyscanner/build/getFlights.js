'use strict';

var _skyscanner = require('./skyscanner');

var _mailer = require('./mailer');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yargs = require('yargs');
var bestPrice = 1000;

var argv = yargs.option('country', {
    alias: 'c',
    describe: 'country of residence',
    demand: true,
    default: 'US'
}).option('currencies', {
    alias: 'cur',
    describe: 'currencies of residence',
    demand: true,
    default: 'USD'
}).option('locale', {
    alias: 'loc',
    describe: 'The user’s localization preference',
    demand: true,
    default: 'en-US'
}).option('originplace', {
    alias: 'orig',
    describe: 'The origin city or airport',
    demand: true
}).option('destinationplace', {
    alias: 'dest',
    describe: 'The destination city or airport',
    demand: true
}).option('outbounddate', {
    alias: 'dep',
    describe: 'The departure date',
    demand: true
}).option('inbounddate', {
    alias: 'ret',
    describe: 'The return date',
    demand: true
}).option('open', {
    alias: 'o',
    describe: 'Open lowest price in browser',
    boolean: true
}).option('adults', {
    describe: 'The number of adults',
    default: 1
}).option('groupPricing', {
    alias: 'group',
    describe: 'Price for all passengers',
    boolean: true
}).argv;

var timeout = 0;

(function main(argv, timeout) {
    setTimeout(function () {
        (0, _skyscanner.createSession)(argv).then(_skyscanner.pollSession).then(_skyscanner.pollNextBatch).then(_skyscanner.pollNextBatch).then(processResult);

        timeout = 300000;
        main(argv, timeout);
    }, timeout);
})(argv, timeout);

function processResult(result) {
    debugger;
    var resultJSON = JSON.parse(result.body);

    var itineraries = resultJSON.Itineraries;

    var emailText = '';

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = itineraries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var itinerary = _step.value;

            var pricingOptions = itinerary.PricingOptions;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = pricingOptions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var details = _step2.value;

                    if (details.Price <= bestPrice) {
                        emailText = emailText + details.Price + ' ' + details.DeeplinkUrl + '\n';
                        bestPrice = details.Price;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    bestPrice = bestPrice - 1;

    if (emailText.length > 0) {
        (0, _mailer.email)(emailText);
    }
}

/*const sessionKey = result.headers.location;
            pollSession(sessionKey).then( result => {
                const resultJSON = JSON.parse(result.body);
                if(resultJSON.Status === 'UpdatesPending'){
                    const nextPollKey = result.headers.location;
                    simplePoll(nextPollKey).then( result => {
                        debugger;

                    });
                } else {
                    handleResult(resultJSON);
                }
            }).then( result => {
                debugger;
                
            });
        }).catch( error => console.log(error));
*/

/*         if(argv.open){
                    open(itineraryRecord.deeplink, 'chrome');
                }*/

/*// Store the price in a MongoDb
insertItinerary(itineraryRecord).then( result => {
    console.log(result);
})*/