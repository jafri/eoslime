const sinon = require('sinon');
const assert = require('assert');
const cryptoJS = require('crypto-js');
const is = require('./../src/helpers/is');
const crypto = require('./../src/helpers/crypto');
const EventClass = require('./../src/helpers/event-class');

describe('Helpers scripts', function () {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(15000);

    describe('crypto.js', function () {
        it('Should hash the data', async () => {
            const expectedHash = 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e';
            const resultedHash = crypto.hash('Hello World');

            assert(expectedHash == resultedHash);
        });

        it('Should encrypt and decrypt a data', async () => {
            const encryptedData = crypto.encrypt('Hello World', '123');
            const decryptedData = crypto.decrypt(encryptedData, '123');

            assert(decryptedData == 'Hello World');
        });

        it('Should throw if it is not able to hash the data', async () => {
            sinon.stub(cryptoJS, "SHA256").throws();
            
            try {
                crypto.hash();
            } catch (error) {
                assert(error.message.includes('Couldn\'t hash the data'));
            }

            sinon.restore();
        });

        it('Should throw if it is not able to encrypt a data', async () => {
            try {
                crypto.encrypt('Hello World', { fake: 'FAKE' });
            } catch (error) {
                assert(error.message.includes('Couldn\'t encrypt the data'));
            }
        });

        it('Should throw if it is not able to decrypt a data', async () => {
            try {
                const encryptedData = crypto.encrypt('Hello World', '123');
                crypto.decrypt(encryptedData, { fake: 'FAKE' });
            } catch (error) {
                assert(error.message.includes('Couldn\'t decrypt the data'));
            }
        });
    });

    describe('event-class.js', function () {
        it('Should be able to subscribe for an event', async () => {
            const eventClass = new EventClass({ 'created': 'created' });
            eventClass.on('created', () => { });

            assert(eventClass.eventsHooks['created'].length == 1);
        });

        it('Should be able to emit an event', async () => {
            const eventClass = new EventClass({ 'created': 'created' });
            let x = 1;

            eventClass.on('created', () => x++);
            eventClass.emit('created');

            assert(x == 2);
        });

        it('Should not be able to subscribe for unknown event', async () => {
            const eventClass = new EventClass({ });
            eventClass.on('created', () => { });

            assert(eventClass.eventsHooks['created'] == undefined);
        });

        it('Should be able to subscribe twice for an event', async () => {
            const eventClass = new EventClass({ 'created': 'created' });
            eventClass.on('created', () => { });
            eventClass.on('created', () => { });

            assert(eventClass.eventsHooks['created'].length == 2);
        });

    });

    describe('is.js', function () {
        it('Should validate such data is an instance of the required one', async () => {
            const x = 'Hello';
            is(x).instanceOf('String');

            assert(true);
        });

        it('Should throw if candidate data is undefined', async () => {
            try {
                is().instanceOf('String');
            } catch (error) {
                assert(error.message.includes('Not an instance of String'));
            }
        });

        it('Should throw if candidate data is not an instance of the required type', async () => {
            try {
                const x = 1;
                is(x).instanceOf('String');
            } catch (error) {
                assert(error.message.includes('Provided Number is not an instance of String'));
            }
        });
    });
});
