const assert = require('assert');
const request = require('supertest');

describe('addresses API should have endpoints to', () => {
    it('get all addresses', (done) => {
      // arrange
        const api = require('./api.js');
      // act and assert
        request(api.app)
        .get('/api/addresses')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.strictEqual(res.body.length, 4);
          })
        .expect(200, done);
    });
    it('get one address', (done) => {
        // arrange
        const api = require('./api.js');
        // act and assert
        request(api.app)
        .get('/api/addresses/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.strictEqual(res.body.name, "Marilyn");
        })
        .expect(200, done);
    });
    it('post an address', (done) => {
        // arrange
        const api = require('./api.js');
        // act and assert
        request(api.app)
        .post('/api/addresses/')
        .set('Accept', 'application/json')
        .send({
            title: "Mr.",
            name: "Elmo",
            lastName: "Muppet",
            street: "Sesame Street",
            lgh: "30",
            city: "New York",
            zip: "11215"
        })
        .expect('Content-Type', /json/)
        .expect('location', /\/api\/addresses\//)
        .expect((res) => {
            assert.strictEqual(res.body.id, 5);
            assert.strictEqual(res.body.name, "Elmo");
            assert.strictEqual(res.body.lgh, "30");
            assert.strictEqual(res.body.city, "New York");
        })
        .expect(201, done);
    });
    it('update an address', (done) => {
        // arrange
        const api = require('./api.js');
        // act and assert
        request(api.app)
        .put('/api/addresses/1')
        .set('Accept', 'application/json')
        .send({
            title: "Mr.",
            name: "Elmo",
            lastName: "Muppet",
            street: "Sesame Street",
            lgh: "30",
            city: "New York",
            zip: "11215"
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.strictEqual(res.body.name, "Elmo");
            assert.strictEqual(res.body.city, "New York");
            assert.strictEqual(res.body.street, "Sesame Street");
        })
        .expect(200, done);
    });
    it('delete an address', (done) => {
        // arrange
        const api = require('./api.js');
        // act and assert
        request(api.app)
        .delete('/api/addresses/1')
        .set('Accept', 'application/json')
        .expect(204, done);
    });
  });