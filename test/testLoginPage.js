const assert = require('chai').assert;
// const routes = require('../routeHandlers/boardPage');
const request = require('supertest');

const DB = require('../app/db/DB');
const server = require('../server');


describe('hooks', function () {

    beforeEach(function () {

    });

    describe('LoginPageRoute GET', function () {
        it('serves the user the login page', function (done) {
            request(server)
                .get('/loginPage.ejs')
                .expect(200)
                .expect(/Login and Registration/, done)
        })
    });

    describe('LoginPageRoute POST', function () {
        it('user logs in successfully', function (done) {
            request(server)
                .post('/loginPage.ejs')
                .send({
                    requestedAction: 'login',
                    username : 'testUserName_999000',
                    password : '999000999000'
                })
                .type('form')
                .expect(302)
                .expect(/Main Menu Page/, done())
        })
    });

    describe('LoginPageRoute POST', function () {
        it('user logs in unsuccessfully', function (done) {
            request(server)
                .post('/loginPage.ejs')
                .send({
                    requestedAction: 'login',
                    username : '',
                    password : ''
                })
                .type('form')
                .expect(200)
                .expect(/Login Page/, done())
        })
    });

    describe('LoginPageRoute POST', function () {
        it('user registers unsuccessfully', function (done) {
            request(server)
                .post('/loginPage.ejs')
                .send({
                    requestedAction: 'register',
                    username : 'testUserName_999000',
                    password : '999000999000'
                })
                .expect(200)
                .expect(/Login Page/, done())

        })
    });

    describe('LoginPageRoute POST', async function () {
        it('user registers successfully', function (done) {
            request(server)
                .post('/loginPage.ejs')
                .send({
                    requestedAction: 'register',
                    username : 'opamodamkasdmkdasmklmlcxbvhnt',
                    password : 'adsmiodasmlkdmskldmsaklmasddsasd'
                })
                .expect(302)
                .expect(/Main Menu Page/, done())

        });

        await DB.initDBConnection();
        let user = await DB.getUserModel();

        await user.deleteOne({username : 'opamodamkasdmkdasmklmlcxbvhnt', password : 'adsmiodasmlkdmskldmsaklmasddsasd'});

        await DB.closeConnection();
    });
});