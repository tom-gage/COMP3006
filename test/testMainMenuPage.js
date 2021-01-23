const assert = require('chai').assert;
// const routes = require('../routeHandlers/boardPage');

const request = require('supertest');
const server = require('../server');


describe('hooks', function () {

    beforeEach(function () {

    });

    describe('mainMenuPage GET', function () {
        it('user accesses the main menu', function (done) {
            request(server).get('/mainMenuPage.ejs')
                .expect(200)
                .expect(/Main Menu Page/, done)
        })
    });

    describe('mainMenuPage POST', function () {
        it('user accesses the main menu', function (done) {
            request(server).get('/mainMenuPage.ejs')
                .expect(200)
                .expect(/Main Menu Page/, done)
        })
    });
});