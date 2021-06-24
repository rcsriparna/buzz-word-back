const makeCell = (index, maxIndex, row, rows, col, cols) => {
  return {
    index,
    maxIndex,
    row,
    rows,
    col,
    cols,
    value: 0,
    location() {
      if (row == rows / 2 - 0.5) {
        //console.log("middle");
        return 0;
      }
      if (row < rows / 2 - 0.5) {
        //console.log("top");
        return -1;
      }
      if (row > rows / 2 - 0.5) {
        //console.log("bottom");
        return 1;
      }
    },
    prev() {
      if (index - 1 > -1 && col > 0) return index - 1;
      else return -1;
    },
    next() {
      if (index + 1 < maxIndex + 1 && col < cols - 1) return index + 1;
      else return -1;
    },
    prevRowL() {
      if (this.location() == -1 || this.location() == 0) {
        if (index - cols > 0 && col > 0) return index - cols;
        else return -1;
      }
      if (this.location() == 1) {
        return index - cols - 1;
      }
    },
    prevRowR() {
      if (this.location() == -1 || this.location() == 0) {
        if (index - cols + 1 > 1 && col < cols - 3) return index - cols + 1;
        else return -1;
      }
      if (this.location() == 1) {
        return index - cols;
      }
    },
    nextRowL() {
      if (this.location() == -1) {
        return index + cols;
      }
      if (this.location() == 1 || this.location() == 0) {
        if (index + cols - 1 < maxIndex + 1 && col > 0) return index + cols - 1;
        else return -1;
      }
    },
    nextRowR() {
      if (this.location() == -1) {
        return index + cols + 1;
      }
      if (this.location() == 1 || this.location() == 0) {
        if (index + cols < maxIndex + 1 && col < cols - 2) return index + cols;
        else return -1;
      }
    },
    neighbours() {
      return [this.prevRowL(), this.prevRowR(), this.prev(), this.next(), this.nextRowL(), this.nextRowR()].filter(
        (n) => n > -1
      );
    },
  };
};

const calcMaxIndex = (min, max) => {
  let maxIndex = 0;
  for (let i = min; i < max; i++) {
    maxIndex += i;
  }
  return maxIndex * 2 + max - 1;
};

const makeGrid = (min, max) => {
  let cells = [];
  const rows = (max - min) * 2 + 1;
  const maxIdx = calcMaxIndex(min, max);
  for (let [cols, row, idx, flag] = [min, 0, 0, false]; cols >= min; flag ? cols-- : cols++) {
    cells.push([]);
    const currentRow = cells[cells.length - 1];
    for (let col = 0; col < cols; col++) {
      currentRow.push(makeCell(idx, maxIdx, row, rows, col, cols));
      idx++;
    }
    row++;
    if (cols == max) flag = true;
  }
  return cells;
};

const cells = makeGrid(2, 9);

console.log(cells);
console.log(cells[6][0].neighbours());
console.log(cells[6][7].neighbours());
console.log(cells[8][0].neighbours());
console.log(cells[8][7].neighbours());
console.log(cells[7][0].neighbours());
console.log(cells[7][8].neighbours());
console.log(cells[0][0].neighbours());
console.log(cells[0][1].neighbours());
console.log(cells[14][0].neighbours());
console.log(cells[14][1].neighbours());
