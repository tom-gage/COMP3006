const assert = require('chai').assert;
// const routes = require('../routeHandlers/boardPage');
const request = require('supertest');

const ActiveGame = require('../app/objects/ActiveGame');
const server = require('../server');


describe('hooks', function () {

    beforeEach(function () {

    });

    describe('BoardPageRoute GET', function () {
        it('user attempts to join a game that doesnt exist', function (done) {
            request(server)
                .get('/boardPage.ejs')
                .query({ gameCode: 1000})
                .expect(200)
                .expect(/Game Not Found!/, done)
        })
    });

    describe('BoardPageRoute POST', function () {
        it('user attempts to create a game', function (done) {
            request(server)
                .post('/boardPage.ejs')
                .send({ requestedAction: 'createGame'})
                .type('form')
                .expect(200)
                .expect(/board page reached/, done)
        })
    });

    describe('BoardPageRoute GET', function () {
        it('user attempts to join a game that exists', function (done) {
            ACTIVE_GAMES.push(new ActiveGame(100, 'p1', 'Not here yet'));

            request(server)
                .get('/boardPage.ejs')
                .query({ gameCode: 100})
                .expect(200)
                .expect(/board page reached!/, done)

        })
    });
});