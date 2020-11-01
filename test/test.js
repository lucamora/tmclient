const expect = require('chai').expect;
const nock = require('nock');
const ThingsMobile = require('../index');

let username = 'username@example.com';
let token = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const tm = new ThingsMobile(username, token);

describe('thingsmobile client tests', function () {
    // activateSim
    before(function () {
		nock('https://api.thingsmobile.com')
			.post('/services/business-api/activateSim')
			.replyWithFile(200,
				__dirname + '/replies/activateSim.xml',
				{ 'Content-Type': 'application/xml' }
			);
	});

	it('should parse activateSim', function (done) {
		tm.activateSim('447937557899', '8944501312167518236', function (err, status) {
			expect(err).to.equal(null);
			expect(status).to.deep.equal(require('./results/activateSim.json'));

			done();
		});
    });
    
    // blockSim
    before(function () {
        nock('https://api.thingsmobile.com')
            .post('/services/business-api/blockSim')
            .replyWithFile(200,
                __dirname + '/replies/blockSim.xml',
                { 'Content-Type': 'application/xml' }
            );
    });

    it('should parse blockSim', function (done) {
        tm.blockSim('447937557899', function (err, status) {
            expect(err).to.equal(null);
            expect(status).to.deep.equal(require('./results/blockSim.json'));

            done();
        });
    });

    // unblockSim
    before(function () {
        nock('https://api.thingsmobile.com')
            .post('/services/business-api/unblockSim')
            .replyWithFile(200,
                __dirname + '/replies/unblockSim.xml',
                { 'Content-Type': 'application/xml' }
            );
    });

    it('should parse unblockSim', function (done) {
        tm.unblockSim('447937557899', function (err, status) {
            expect(err).to.equal(null);
            expect(status).to.deep.equal(require('./results/unblockSim.json'));

            done();
        });
    });

    // simStatus
    before(function () {
        nock('https://api.thingsmobile.com')
            .post('/services/business-api/simStatus')
            .replyWithFile(200,
                __dirname + '/replies/simStatus.xml',
                { 'Content-Type': 'application/xml' }
            );
    });

    it('should parse simStatus', function (done) {
        tm.simStatus('447937557899', function (err, status) {
            expect(err).to.equal(null);

            // convert date to string to allow object equivalence assertion
            status['lastConnection'] = status['lastConnection'].toJSON();
            status['plan']['activation'] = status['plan']['activation'].toJSON();
            status['plan']['expiration'] = status['plan']['expiration'].toJSON();
            status['cdrs'].forEach(x => {
                x['start'] = x['start'].toJSON();
                x['stop'] = x['stop'].toJSON();
            });

            expect(status).to.deep.equal(require('./results/simStatus.json'));

            done();
        });
    });

    // simList
    before(function () {
        nock('https://api.thingsmobile.com')
            .post('/services/business-api/simListLite')
            .replyWithFile(200,
                __dirname + '/replies/simList.xml',
                { 'Content-Type': 'application/xml' }
            );
    });

    it('should parse simList', function (done) {
        tm.simList(function (err, status) {
            expect(err).to.equal(null);

            // convert date to string to allow object equivalence assertion
            status.forEach(x => {
                x['lastConnection'] = x['lastConnection'].toJSON();
                x['plan']['activation'] = x['plan']['activation'].toJSON();
                x['plan']['expiration'] = x['plan']['expiration'].toJSON();
            });

            expect(status).to.deep.equal(require('./results/simList.json'));

            done();
        });
    });

    // credit
    before(function () {
        nock('https://api.thingsmobile.com')
            .post('/services/business-api/credit')
            .replyWithFile(200,
                __dirname + '/replies/credit.xml',
                { 'Content-Type': 'application/xml' }
            );
    });

    it('should parse credit', function (done) {
        tm.credit(function (err, status) {
            expect(err).to.equal(null);

            // convert date to string to allow object equivalence assertion
            status['history'].forEach(x => {
                x['date'] = x['date'].toJSON();
            });

            expect(status).to.deep.equal(require('./results/credit.json'));

            done();
        });
    });
});