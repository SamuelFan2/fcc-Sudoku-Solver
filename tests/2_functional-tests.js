const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    
    // # 1
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'solution', 'a valid puzzle should return an object which contains solution property')
                done();
            })
    })

    // # 2
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'a missint string puzzle should return an object which contains solution property');
                assert.strictEqual(res.body.error, 'Required field missing', `expect ${res.body.error} to be equal to "Required field missing"`);
                done();
            })
    })

    // # 3
    test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: '//9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'a puzzle with invalid characters should return an object which contains solution property');
                assert.strictEqual(res.body.error, 'Invalid characters in puzzle', `expect ${res.body.error} to be equal to "Invalid characters in puzzle"`);
                done();
            })
    })

    // # 4
    test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: '9'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'a puzzle with incorrect length should return an object which contains solution property');
                assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long', `expect ${res.body.error} to be equal to "Expected puzzle to be 81 characters long"`);
                done();
            })
    })

    // # 5
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: '999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'a puzzle that cannot be solved should return an object which contains solution property');
                assert.strictEqual(res.body.error, 'Puzzle cannot be solved', `expect ${res.body.error} to be equal to "Puzzle cannot be solved"`);
                done();
            })
    })

    // # 6
    test('Check a puzzle placement with all fields: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value:'7'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'valid', 'Check a puzzle placement with all fields should return an object which contains "valid" property');
                assert.notProperty(res.body, 'conflict', 'Check a puzzle placement with all fields should not return an object which contains "conflict" property')
                assert.strictEqual(res.body.valid, true, `expect ${res.body.valid} to be equal to true`);
                done();
            })
    })

    // # 7
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value:'6'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'valid', 'Check a puzzle placement with single placement conflict should return an object which contains "valid" property');
                assert.property(res.body, 'conflict', 'Check a puzzle placement with single placement conflict should return an object which contains "conflict" property')
                assert.strictEqual(res.body.valid, false, `expect ${res.body.valid} to be equal to false`);
                assert.strictEqual(res.body.conflict.length, 1, `expect ${res.body.conflict.length} to be equal to 1`);
                done();
            })
    })

     // # 8
     test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value:'1'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'valid', 'Check a puzzle placement with multiple placement conflict should return an object which contains "valid" property');
                assert.property(res.body, 'conflict', 'Check a puzzle placement with multiple placement conflict should return an object which contains "conflict" property')
                assert.strictEqual(res.body.valid, false, `expect ${res.body.valid} to be equal to false`);
                assert.strictEqual(res.body.conflict.length, 2, `expect ${res.body.conflict.length} to be equal to 2`);
                done();
            })
    })

    // # 9
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value:'5'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'valid', 'Check a puzzle placement with all placement conflict should return an object which contains "valid" property');
                assert.property(res.body, 'conflict', 'Check a puzzle placement with all placement conflict should return an object which contains "conflict" property')
                assert.strictEqual(res.body.valid, false, `expect ${res.body.valid} to be equal to false`);
                assert.strictEqual(res.body.conflict.length, 3, `expect ${res.body.conflict.length} to be equal to 3`);
                done();
            })
    })

    // # 10
    test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({coordinate: 'A1', value:'5'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'Check a puzzle placement with missing required fields should return an error');
                assert.strictEqual(res.body.error, 'Required field(s) missing', `expect ${res.body.valid} to be equal to "Required field(s) missing"`);
                done();
            })
    })

    // # 11
    test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '//9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value:'5'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'Check a puzzle placement with invalid characters should return an error');
                assert.strictEqual(res.body.error, 'Invalid characters in puzzle', `expect ${res.body.valid} to be equal to "Invalid characters in puzzle"`);
                done();
            })
    })

    // # 12
    test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: '9', coordinate: 'A1', value:'5'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'Check a puzzle placement with incorrect length should return an error');
                assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long', `expect ${res.body.valid} to be equal to "Expected puzzle to be 81 characters long"`);
                done();
            })
    })

    // # 13
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({coordinate: 'Z1', value:'5', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'Check a puzzle placement with invalid placement coordinate should return an error');
                assert.strictEqual(res.body.error, 'Invalid coordinate', `expect ${res.body.valid} to be equal to "Invalid coordinate"`);
                done();
            })
    })

    // # 14
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({coordinate: 'A1', value:'0', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.strictEqual(res.status, 200, 'Response status should be 200');
                assert.property(res.body, 'error', 'Check a puzzle placement with invalid placement value should return an error');
                assert.strictEqual(res.body.error, 'Invalid value', `expect ${res.body.valid} to be equal to "Invalid value"`);
                done();
            })
    })
});

