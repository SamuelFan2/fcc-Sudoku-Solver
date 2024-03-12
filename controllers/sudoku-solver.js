class SudokuSolver {

  validate(puzzleString) {
    // if it is undefined
    if (!puzzleString) {
      return {error: 'Required field missing'};
    }

    // check if it is greater or less than 81 characters
    if (puzzleString.length !== 81) {
      return {error: 'Expected puzzle to be 81 characters long'};
    }

    // check if it contains values which are not numbers or periods
    if (/[^\d\.]/.test(puzzleString)) {
      return {error: 'Invalid characters in puzzle'};
    };

    return false;
  }


  checkRowPlacement(puzzleString, row, column, value) {

    for (let i = 0; i < 9; i++) {
      let index = i + row * 9;
      if (puzzleString[index] === value && i !== (column-1)) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {

    for (let i = 0; i < 9; i++) {
      let index = i * 9 + column - 1;
      if (puzzleString[index] === value && i !== row) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {

    let regionRow = Math.floor(row / 3);
    let regionColumn = Math.floor((column - 1) / 3);
    let position = row * 9 + column - 1

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let index = (regionRow * 27 )+ i * 9 + (regionColumn * 3 + j);
        if (puzzleString[index] === value && index !== position) {
          return false;
        }
      }
    }
    return true;
  }

  checkAll(string, row, column, value) {
    let conflict = [];   
    // check row
    let rowCheck = this.checkRowPlacement(string, row, column, value);
    if (!rowCheck) {
      conflict.push('row');
    }

    // check column
    let columnCheck = this.checkColPlacement(string, row, column, value);
    if (!columnCheck) {
      conflict.push('column');
    }

    // check region
    let regionCheck = this.checkRegionPlacement(string, row, column, value);
    if (!regionCheck) {
      conflict.push('region');
    }
    // console.log(string, row, column, value, conflict);
    return conflict;
  }

  checkForSolving(arr, index, value) {
    let row = Math.floor(index / 9);
    let column = index - row * 9 + 1;
    let string = arr.join("");
    
    if (this.checkAll(string, row, column, value).length === 0){
      return true;
    } else {
      return false;
    }
  }

  solve(puzzleString) {
    let puzzleArr = [...puzzleString];
    // find which index is fixed
    let fixedArr = []
    let fixed = puzzleString.split("").map( (n, index) => {
      if (n === '.') {
        return false;
      } else {
        fixedArr.push(index);
        return true;
      }
    })

    // check if puzzle is invalid
    for (let i = 0; i < fixedArr.length; i++) {
      let check = this.checkForSolving(puzzleArr, fixedArr[i], puzzleArr[fixedArr[i]])
      if (!check) {
        return {error: 'Puzzle cannot be solved'};
      }
    }
    
    return this.backtracking(puzzleArr, fixed, 0);

  }

  backtracking(arr, fixed, index, valid = true) {
    
    if (index < 0) {
      return {error: 'Puzzle cannot be solved'}
    }

    if (fixed[index] && valid === true && index !== 80) {
      //console.log('next');
      return this.backtracking(arr, fixed, index + 1, true);

      
    } else if (fixed[index] && valid === true && index === 80) {
      // console.log('finish);
      return {solution: arr.join("")};


    } else if (fixed[index] && valid === false) {
      //console.log('back');
      return this.backtracking(arr, fixed, index - 1, false);
    }

    if (arr[index] == 9) {
      arr[index] = '.';
      //console.log('back');
      return this.backtracking(arr, fixed, index - 1, false);

    } else {

      // increase the number
      if (arr[index] === ".") {
        arr[index] = 1;
      } else if (arr[index] <= 8) {
        arr[index] = arr[index] + 1;
      }

      // check valid
      // if not valid, add 1
      if (!this.checkForSolving(arr, index, arr[index].toString())) {
        //console.log('invalid, +1');
        return this.backtracking(arr, fixed, index);

      // if valid and the puzzle is solved
      } else if (index === 80) {
        return {solution: arr.join("")};

      // if valid and the puzzle has not been finished yet
      } else {
        //console.log(arr[index], index, 'valid, next')
        return this.backtracking(arr, fixed , index + 1, true);
      }

    } 
  }
}

module.exports = SudokuSolver;

