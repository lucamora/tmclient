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
};

function _parseSim(sim) {
	let status = {
		name: sim['name'],
		tag: sim['tag'],
		msisdn: sim['msisdn'],
		iccid: sim['iccid'],
		type: sim['type'],
		status: sim['status'],
		lastConnection: new Date(sim['lastconnectiondate']),
		plan: {
			type: sim['plan'],
			activation: new Date(sim['activationdate']),
			expiration: new Date(sim['expirationdate'])
		},
		balance: parseFloat(sim['balance']),
		traffic: {
			daily: parseFloat(sim['dailytraffic']) || 0,
			monthly: parseFloat(sim['monthlytraffic']) || 0,
			total: parseFloat(sim['totaltraffic']) || 0
		},
		threshold: {
			daily: parseFloat(sim['dailytrafficthreshold']) || 0,
			monthly: parseFloat(sim['monthlytrafficthreshold']) || 0,
			total: parseFloat(sim['totaltrafficthreshold']) || 0
		},
		blockSim: {
			daily: parseInt(sim['blocksimdaily']) || 0,
			monthly: parseInt(sim['blocksimmonthly']) || 0,
			total: parseInt(sim['blocksimtotal']) || 0,
			afterExpiration: parseInt(sim['blocksimafterexpirationdate']) || 0
		},
		cdrs: _parseCdrs(sim['cdrs'])
	};

	return status;
}

function _parseSimLite(sim) {
	let status = {
		name: sim['name'],
		tag: sim['tag'],
		msisdn: sim['msisdn'],
		iccid: sim['iccid'],
		status: sim['status'],
		type: sim['type'],
		lastConnection: new Date(sim['lastconnectiondate']),
		plan: {
			type: sim['plan'],
			activation: new Date(sim['activationdate']),
			expiration: new Date(sim['expirationdate'])
		},
		balance: parseFloat(sim['balance']),
		traffic: {
			monthly: parseFloat(sim['monthlytraffic']) || 0
		}
	};

	return status;
}

function _parseHistory(history) {
	let cdrs = [];

	if (history['historyrow']) {
		let list = history['historyrow'];

		// if there is only an history entry
		// create an array with a single element
		if (!Array.isArray(list)) {
			list = [list];
		}

		cdrs = list.map(function (row) {
			return {
				amount: parseFloat(row['amount']),
				date: new Date(row['dateload']),
				description: row['opdescription'],
				msisdn: row['msisdn']
			};
		});
	}

	return cdrs;
}

function _parseCdrs(cdrs) {
	let result = [];

	if (cdrs['cdr']) {
		let list = cdrs['cdr'];

		// if there is only a cdr entry
		// create an array with a single element
		if (!Array.isArray(list)) {
			list = [list];
		}

		result = list.map(function (cdr) {
			return {
				start: new Date(cdr['cdrdatestart']),
				stop: new Date(cdr['cdrdatestop']),
				traffic: parseFloat(cdr['cdrtraffic']),
				country: cdr['cdrcountry'],
				imsi: cdr['cdrimsi'],
				network: cdr['cdrnetwork'],
				operator: cdr['cdroperator']
			};
		}).reverse();
	}

	return result;
}

module.exports.simStatus = function (parsed, callback) {
	// parse full version of sim details
	let status = _parseSim(parsed['sims']['sim']);

	callback(null, status);
};

module.exports.simList = function (parsed, callback) {
	let list = parsed['sims']['sim'];

	// if there is only a SIM
	// create an array with a single element
	if (!Array.isArray(list)) {
		list = [list];
	}

	let sims = [];
	list.forEach(function (sim) {
		// parse lite version of sim details
		sims.push(_parseSimLite(sim));
	});

	callback(null, sims);
};

module.exports.credit = function (parsed, callback) {
	let credit = {
		amount: parseFloat(parsed['amount']),
		currency: parsed['currency'],
		history: _parseHistory(parsed['credithistory'])
	};

	callback(null, credit);
};

module.exports.downloadCdr = function (parsed, callback) {
	let cdr = {
		history: _parseHistory(parsed['credithistory'])
	};

	callback(null, cdr);
};