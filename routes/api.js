'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      
      // check if puzzle, coordinate or value is missing 
      if (!puzzle || !coordinate || !value) {
        res.json({error: 'Required field(s) missing'});
        return;
      }

      // check if puzzle string is valid
      if (solver.validate(puzzle)) {
        res.json(solver.validate(puzzle));
        return;
      }

      // check value
      if (!/^[1-9]$/.test(value)) {
        res.json({error: "Invalid value"})
        return;
      }

      // check coordinate valid
      if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
        res.json({error: "Invalid coordinate"});
        return;
      }
      
      let row = coordinate[0];
      let rowNumber = row.toUpperCase().charCodeAt() - 65;
      let column = Number(coordinate[1]);
      let conflict = solver.checkAll(puzzle, rowNumber, column, value);
      
      if (conflict.length === 0) {
        res.json({valid: true});
      } 

      res.json({valid: false, conflict: conflict});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      
      // check if puzzle string is valid
      if (solver.validate(puzzle)) {
        res.json(solver.validate(puzzle));
        return;
      }

      res.json(solver.solve(puzzle));
    });
};
