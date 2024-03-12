const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver = new Solver();

suite('Unit Tests', () => {
    let validPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    let invalidPuzzleString = '999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    
    // #1
    test('Logic handles a valid puzzle string of 81 characters', () => {
        let output = solver.validate(validPuzzleString);
        assert.notProperty(output,'error','A valid puzzle string should not return an error')
    })

    // #2
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        let output = solver.validate('/.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
        assert.property(output,'error','A puzzle string with invalid characters should return an error');
        assert.strictEqual(output.error,'Invalid characters in puzzle',`expect ${output.error} to be equal to "Invalid characters in puzzle"`)
     })

     // #3
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        let output = solver.validate('...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
        assert.property(output,'error','A puzzle string which is not 81 characters in length should return an error');
        assert.strictEqual(output.error,'Expected puzzle to be 81 characters long',`expect ${output.error} to be equal to "Expected puzzle to be 81 characters long"`)
     })

     // #4
    test('Logic handles a valid row placement', () => {
        let output1 = solver.checkRowPlacement(validPuzzleString, 0, 1, '7');
        let output2 = solver.checkRowPlacement(validPuzzleString, 3, 4, '7');
        let output3 = solver.checkRowPlacement(validPuzzleString, 7, 7, '9');
        assert.strictEqual(output1, true,'A valid row placement should return true');
        assert.strictEqual(output2, true,'A valid row placement should return true');
        assert.strictEqual(output3, true,'A valid row placement should return true');
     })

     // #5
    test('Logic handles an invalid row placement', () => {
        let output1 = solver.checkRowPlacement(validPuzzleString, 0, 1, '1');
        let output2 = solver.checkRowPlacement(validPuzzleString, 3, 4, '8');
        let output3 = solver.checkRowPlacement(validPuzzleString, 7, 7, '3');
        assert.strictEqual(output1, false,'An ivalid row placement should return false');
        assert.strictEqual(output2, false,'An ivalid row placement should return false');
        assert.strictEqual(output3, false,'An ivalid row placement should return false');
     })

     // #6
    test('Logic handles a valid column placement', () => {
        let output1 = solver.checkColPlacement(validPuzzleString, 0, 1, '9');
        let output2 = solver.checkColPlacement(validPuzzleString, 3, 4, '1');
        let output3 = solver.checkColPlacement(validPuzzleString, 7, 7, '4');
        assert.strictEqual(output1, true,'A valid column placement should return true');
        assert.strictEqual(output2, true,'A valid column  placement should return true');
        assert.strictEqual(output3, true,'A valid column placement should return true');
     })
     
     // #7
    test('Logic handles an invalid column placement', () => {
        let output1 = solver.checkColPlacement(validPuzzleString, 0, 1, '1');
        let output2 = solver.checkColPlacement(validPuzzleString, 3, 4, '3');
        let output3 = solver.checkColPlacement(validPuzzleString, 7, 7, '6');
        assert.strictEqual(output1, false,'An ivalid column placement should return false');
        assert.strictEqual(output2, false,'An ivalid column placement should return false');
        assert.strictEqual(output3, false,'An ivalid column placement should return false');
     })

    // #8
    test('Logic handles a valid region (3x3 grid) placement', () => {
        let output1 = solver.checkRegionPlacement(validPuzzleString, 0, 1, '1');
        let output2 = solver.checkRegionPlacement(validPuzzleString, 3, 4, '3');
        let output3 = solver.checkRegionPlacement(validPuzzleString, 7, 7, '5');
        assert.strictEqual(output1, true,'A valid region placement should return true');
        assert.strictEqual(output2, true,'A valid region placement should return true');
        assert.strictEqual(output3, true,'A valid region placement should return true');
     })

     // #9
     test('Logic handles an invalid region (3x3 grid) placement', () => {
        let output1 = solver.checkRegionPlacement(validPuzzleString, 0, 1, '8');
        let output2 = solver.checkRegionPlacement(validPuzzleString, 3, 4, '7');
        let output3 = solver.checkRegionPlacement(validPuzzleString, 7, 7, '1');
        assert.strictEqual(output1, false,'An ivalid region placement should return false');
        assert.strictEqual(output2, false,'An ivalid region placement should return false');
        assert.strictEqual(output3, false,'An ivalid region placement should return false');
     })

     // #10
     test('Valid puzzle strings pass the solver', () => {
        let output = solver.solve(validPuzzleString);
        assert.notProperty(output, 'error','A valid puzzle strings should not return an error');
     })

     // #11
     test('Invalid puzzle strings fail the solver', () => {
        let output = solver.solve(invalidPuzzleString);
        assert.property(output, 'error','A invalid puzzle strings should return an error');
     })

     // #12
     test('Solver returns the expected solution for an incomplete puzzle', () => {
        for (let i = 0; i < puzzlesAndSolutions.length; i++) {
            assert.strictEqual(solver.solve(puzzlesAndSolutions[i][0]).solution, puzzlesAndSolutions[i][1],'A invalid puzzle strings should return an error');
        }
     })
});
