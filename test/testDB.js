const assert = require('chai').assert;
const DB = require('../app/utilityClasses/DB');

describe('hooks', function () {

    beforeEach(function () {


    });

    describe('DB.getUserModel()', async function () {
        it('should return User model', async function () {
            const result = await DB.getUserModel();

            assert.equal(typeof result, 'object');

            await DB.initDBConnection();
        })
    });

    // describe('DB.initDBConnection()', async function () {
    //     it('should return true if successful connection attempt to database is made, else return false', async function () {
    //         const result = await DB.initDBConnection();
    //
    //         assert.equal(result, true);
    //     })
    // });

    describe('DB.getUserModel()', async function () {
        it('should return User model', async function () {
            const result = await DB.getUserModel();

            assert.equal(typeof result, 'function');
        })
    });
});