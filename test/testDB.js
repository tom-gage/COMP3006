const assert = require('chai').assert;
const DB = require('../app/db/DB');

describe('hooks', function () {

    beforeEach(function () {


    });

    describe('DB.initDBConnection()', async function () {
        it('should return true if successful connection attempt to database is made, else return false', async function () {
            let isConnected = DB.initDBConnection().then(function (isConnected, err) {
                if(err){
                    console.log(err);
                }
                assert.equal(isConnected, true);
            });
        })
    });

    describe('DB.getUserModel()', async function () {
        it('should return User model', async function () {
            const result = await DB.getUserModel();

            assert.equal(typeof result, 'function');
        })
    });





});