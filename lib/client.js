const request = require('request');
const parser = require('./parser');
const error = require('./error');

const TM_API_BASE_URL = 'https://www.thingsmobile.com/services/business-api/';
const TM_API = {
	activateSim: TM_API_BASE_URL + 'activateSim',
	blockSim: TM_API_BASE_URL + 'blockSim',
	unblockSim: TM_API_BASE_URL + 'unblockSim',
	simStatus: TM_API_BASE_URL + 'simStatus',
	simList: TM_API_BASE_URL + 'simList',
	credit: TM_API_BASE_URL + 'credit'
};

class ThingsMobile {
	constructor(username, token) {
		this.username = username;
		this.token = token;
	}

	_basicForm() {
		// provide basic form object with authentication
		return {
			username: this.username,
			token: this.token
		};
	}

	activateSim(msisdn, simBarcode, callback) {
		let form = this._basicForm();
		form['msisdn'] = msisdn;
		form['simBarcode'] = simBarcode;

		request.post(TM_API['activateSim'], { form }, function (err, resp, body) {
			if (err) {
				callback(error.network(err));
				return;
			}

			// parse response
			parser.parse(body, function (e, parsed) {
				if (e) {
					// create parse error object
					callback(error.parse(e));
					return;
				}

				// analyze response to check if there is an error
				let errobj = error.analyze(resp, parsed);
				if (errobj) {
					callback(errobj);
					return;
				}

				callback(null, { done: true, message: 'SIM activated' });
			});
		});
	}

	blockSim(msisdn, callback) {
		let form = this._basicForm();
		form['msisdn'] = msisdn;

		request.post(TM_API['blockSim'], { form }, function (err, resp, body) {
			if (err) {
				callback(error.network(err));
				return;
			}

			// parse response
			parser.parse(body, function (e, parsed) {
				if (e) {
					// create parse error object
					callback(error.parse(e));
					return;
				}

				// analyze response to check if there is an error
				let errobj = error.analyze(resp, parsed);
				if (errobj) {
					callback(errobj);
					return;
				}

				callback(null, { done: true, message: 'SIM blocked' });
			});
		});
	}

	unblockSim(msisdn, callback) {
		let form = this._basicForm();
		form['msisdn'] = msisdn;

		request.post(TM_API['unblockSim'], { form }, function (err, resp, body) {
			if (err) {
				callback(error.network(err));
				return;
			}

			// parse response
			parser.parse(body, function (e, parsed) {
				if (e) {
					// create parse error object
					callback(error.parse(e));
					return;
				}

				// analyze response to check if there is an error
				let errobj = error.analyze(resp, parsed);
				if (errobj) {
					callback(errobj);
					return;
				}

				callback(null, { done: true, message: 'SIM unblocked' });
			});
		});
	}

	simStatus(msisdn, callback) {
		let form = this._basicForm();
		form['msisdn'] = msisdn;

		request.post(TM_API['simStatus'], { form }, function (err, resp, body) {
			if (err) {
				callback(error.network(err));
				return;
			}

			// parse response
			parser.parse(body, function (e, parsed) {
				if (e) {
					// create parse error object
					callback(error.parse(e));
					return;
				}

				// analyze response to check if there is an error
				let errobj = error.analyze(resp, parsed);
				if (errobj) {
					callback(errobj);
					return;
				}

				parser.simStatus(parsed, callback);
			});
		});
	}

	simList(callback) {
		let form = this._basicForm();

		request.post(TM_API['simList'], { form }, function (err, resp, body) {
			if (err) {
				callback(error.network(err));
				return;
			}

			// parse response
			parser.parse(body, function (e, parsed) {
				if (e) {
					// create parse error object
					callback(error.parse(e));
					return;
				}

				// analyze response to check if there is an error
				let errobj = error.analyze(resp, parsed);
				if (errobj) {
					callback(errobj);
					return;
				}

				parser.simList(parsed, callback);
			});
		});
	}

	credit(callback) {
		let form = this._basicForm();

		request.post(TM_API['credit'], { form }, function (err, resp, body) {
			if (err) {
				callback(error.network(err));
				return;
			}

			// parse response
			parser.parse(body, function (e, parsed) {
				if (e) {
					// create parse error object
					callback(error.parse(e));
					return;
				}

				// analyze response to check if there is an error
				let errobj = error.analyze(resp, parsed);
				if (errobj) {
					callback(errobj);
					return;
				}

				parser.credit(parsed, callback);
			});
		});
	}
}

module.exports = ThingsMobile;