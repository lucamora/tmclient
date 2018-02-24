const xml2js = require('xml2js').parseString;

const PARSER_OPTIONS = {
    normalizeTags: true,
    explicitRoot: false,
    explicitArray: false
};

module.exports.parse = function (body, callback) {
    xml2js(body, PARSER_OPTIONS, function (err, res) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, res);
    });
}

function _parseSim(sim) {
    return {
        name: sim['name'],
        tag: sim['tag'],
        msisdn: sim['msisdn'],
        status: sim['status'],
        lastConnection: new Date(sim['lastconnectiondate']),
        plan: {
            type: sim['plan'],
            activation: new Date(sim['activationdate']),
            expiration: new Date(sim['expirationdate'])
        },
        balance: parseFloat(sim['balance']),
        traffic: {
            daily: parseFloat(sim['dailytraffic']),
            monthly: parseFloat(sim['monthlytraffic']),
            total: parseFloat(sim['totaltraffic'])
        },
        cdrs: sim['cdrs']['cdr'].map(function (cdr) {
            return {
                start: new Date(cdr['cdrdatestart']),
                stop: new Date(cdr['cdrdatestop']),
                traffic: parseFloat(cdr['cdrtraffic']),
                country: cdr['cdrcountry'],
                imsi: cdr['cdrimsi'],
                network: cdr['cdrnetwork']
            };
        }).reverse()
    };
}

module.exports.simStatus = function (parsed, callback) {
    let status = _parseSim(parsed['sims']['sim']);

    callback(null, status);
}

module.exports.simList = function (parsed, callback) {
    let list = parsed['sims']['sim'];

    // if there is only a SIM
    // create an array with a single element
    if (!Array.isArray(list)) {
        list = [list];
    }

    let sims = [];
    list.forEach(function (sim) {
        sims.push(_parseSim(sim));
    });

    callback(null, sims);
}

module.exports.credit = function (parsed, callback) {
    let credit = {
        amount: parseFloat(parsed['amount']),
        currency: parsed['currency'],
        history: parsed['credithistory']['historyrow'].map(function (row) {
            return {
                amount: parseFloat(row['amount']),
                date: new Date(row['dateload']),
                description: row['opdescription'],
                msisdn: row['msisdn']
            };
        })
    };

    callback(null, credit);
}