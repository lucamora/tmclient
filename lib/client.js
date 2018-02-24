const request = require('request');
const parser = require('./parser');
const error = require('./error');

const TM_API_BASE_URL = 'https://www.thingsmobile.com/services/business-api/';
const TM_API = {
    simStatus: TM_API_BASE_URL + 'simStatus',
    simList: TM_API_BASE_URL + 'simList'
};

class ThingsMobile {
    constructor(options) {
        this.username = options['username'];
        this.token = options['token'];
    }

    _basicForm() {
        // provide basic form object with authentication
        return {
            username: this.username,
            token: this.token
        }
    }

    simStatus(msisdn, callback) {
        let form = this._basicForm();
        form['msisdn'] = msisdn

        request.post(TM_API['simStatus'], { form: form }, function (err, resp, body) {
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

        request.post(TM_API['simList'], { form, form }, function (err, resp, body) {
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
}

module.exports = ThingsMobile;