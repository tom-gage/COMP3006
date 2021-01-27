const assert = require('chai').assert;
const loadtest = require('loadtest');
const DB = require('../app/db/DB');

describe('hooks', function () {

    beforeEach(function () {


    });

    after(function () {
        DB.closeConnection();
    });

    describe('load test, GET mainMenuPage.ejs', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/mainMenuPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'GET'
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });

    describe('load test, GET boardPage.ejs', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/boardPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'GET'
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });

    describe('load test, GET loginPage.ejs', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/loginPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'GET'
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });


    describe('load test, POST mainMenuPage.ejs', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/mainMenuPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'POST'
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });

    describe('load test, POST boardPage.ejs', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/boardPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'POST'
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });

    describe('load test, POST loginPage.ejs', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/loginPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'POST'
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });

    describe('load test, POST boardPage.ejs, request create new game', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/boardPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'POST',
                body:{
                    requestedAction : 'createGame'
                }
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });

    describe('load test, POST boardPage.ejs, request login', async function () {
        it('server should respond in a reasonable amount of time', async function () {
            let _result;
            const options = {
                url: 'http://localhost:9000/boardPage.ejs',
                maxRequests: 1000,
                maxSeconds: 5,
                method: 'POST',
                body:
                    {
                        requestedAction: 'login',
                        username : 'testUserName_999000',
                        password : '999000999000'
                    }
            };

            await loadtest.loadTest(options, async function(error, result)
            {
                _result = result;
                assert.isAtMost(_result.meanLatencyMS, 6);
                assert.isAtMost(_result.totalErrors, 1);
            });
        })
    });
});



