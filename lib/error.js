function _getErrorMessage(statusCode) {
	if (statusCode == 404) {
		return 'resource not found';
	}
	else if (statusCode == 500) {
		return 'internal server error';
	}
	else {
		return 'no message';
	}
}

module.exports.parse = function (err) {
	return {
		type: 'parse',
		err: err
	};
};

module.exports.network = function (err) {
	return {
		type: 'network',
		err: err
	};
};

module.exports.analyze = function (resp, parsed) {
	if (resp.statusCode != 200) {
		return {
			type: 'service',
			code: resp.statusCode,
			message: _getErrorMessage(resp.statusCode),
		};
	}
	else {
		if (parsed['done'] == 'false') {
			return {
				type: 'service',
				code: parsed['errorcode'] || 0,
				message: parsed['errormessage'] || ''
			};
		}
		else {
			return null;
		}
	}
};