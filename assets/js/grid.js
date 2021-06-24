"use strict";

export const createSVGElement = (settings, tag, add) => {
  let element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const key in settings) element.setAttribute(String(key), settings[key]);
  if (add) add.appendChild(element);
  return element;
};

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Hexagon {
  constructor(size, origin, q, r, s, parent, heading, container) {
    this.size = size;
    this.origin = origin;
    this.parent = parent;
    this.heading = heading;
    this.q = q;
    this.r = r;
    this.s = s;
    this.selected = false;
    this.container = container;
    this.flat = this.orientation(
      3.0 / 2.0,
      0.0,
      Math.sqrt(3.0) / 2.0,
      Math.sqrt(3.0),
      2.0 / 3.0,
      0.0,
      -1.0 / 3.0,
      Math.sqrt(3.0) / 3.0,
      0.0
    );
    this.pointy = this.orientation(
      Math.sqrt(3.0),
      Math.sqrt(3.0) / 2.0,
      0.0,
      3.0 / 2.0,
      Math.sqrt(3.0) / 3.0,
      -1.0 / 3.0,
      0.0,
      2.0 / 3.0,
      0.5
    );
    this.layout = {
      orientation: this.heading === "flat" ? this.flat : this.pointy,
      size: this.size,
      origin: this.origin,
    };

    this.svg = this.make(this.container);
    this.container.id = `cell-[${this.q}][${this.r}][${this.s}]`;
    this.coordsLbl = this.makeCoordsLbl(this.container);
    this.letter = this.makeLetter(this.container);
    this.neighbours = [
      this.hexAdd({ q: this.q, r: this.r, s: this.s }, this.hex(1, 0, -1)),
      this.hexAdd({ q: this.q, r: this.r, s: this.s }, this.hex(1, -1, 0)),
      this.hexAdd({ q: this.q, r: this.r, s: this.s }, this.hex(0, -1, 1)),
      this.hexAdd({ q: this.q, r: this.r, s: this.s }, this.hex(-1, 0, 1)),
      this.hexAdd({ q: this.q, r: this.r, s: this.s }, this.hex(-1, 1, 0)),
      this.hexAdd({ q: this.q, r: this.r, s: this.s }, this.hex(0, 1, -1)),
    ];
  }

  clicked(e) {
    const cell = e.target;
    if (this.neighbours.some((n) => this.parent.getCell(n).selected) || this.parent.selectedCount == 0) {
      this.selected = !this.selected;
      if (this.selected) this.parent.selectedCount++;
      else this.parent.selectedCount--;
      const count = document.querySelectorAll(".green").length;
      cell.classList.toggle("green");
      cell.dataset.index = count;
      cell.dataset.selected = this.selected;
      console.log(cell.children[1].innerHTML, cell.children[2].innerHTML, this.hexToPixel());
    }
  }

  make(g) {
    g.addEventListener("click", this.clicked.bind(this));
    return createSVGElement(
      {
        points: this.polygonCorners(),
        "data-id": `${this.q},${this.r},${this.s}`,
      },
      "polygon",
      g
    );
  }

  makeCoordsLbl(g) {
    const xyz = createSVGElement(
      {
        ...this.hexToPixel(),
        dx: 0,
        dy: -20,
        "text-anchor": "middle",
        "font-size": "8",
        fill: "black",
        stroke: "none",
      },
      "text",
      g
    );
    xyz.innerHTML = `x:${this.q},y:${this.r},z:${this.s}`;
    return xyz;
  }

  makeLetter(g) {
    return createSVGElement(
      {
        ...this.hexToPixel(),
        dx: 0,
        dy: 5,
        "text-anchor": "middle",
        "font-size": "26",
        fill: "black",
        class: "letter",
      },
      "text",
      g
    );
  }

  hex(q, r, s) {
    if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
    return { q: q, r: r, s: s };
  }

  hexAdd(a, b) {
    return this.hex(a.q + b.q, a.r + b.r, a.s + b.s);
  }

  hexScale(a, k) {
    return this.hex(a.q * k, a.r * k, a.s * k);
  }

  orientation(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
    return { f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, start_angle: start_angle };
  }

  hexToPixel() {
    const x = (this.layout.orientation.f0 * this.q + this.layout.orientation.f1 * this.r) * this.size.x;
    const y = (this.layout.orientation.f2 * this.q + this.layout.orientation.f3 * this.r) * this.size.y;
    return new Point(x + this.origin.x, y + this.origin.y);
  }

  hexCornerOffset(corner, offset = 0) {
    const angle = (2.0 * Math.PI * (this.layout.orientation.start_angle - corner)) / 6.0;
    return new Point((this.size.x - offset) * Math.cos(angle), (this.size.y - offset) * Math.sin(angle));
  }

  polygonCorners() {
    const corners = [];
    const center = this.hexToPixel();
    for (let i = 0; i < 6; i++) {
      const offset = this.hexCornerOffset(i, this.parent.offset);
      corners.push(`${center.x + offset.x} ${center.y + offset.y}`);
    }
    return corners.join(",");
  }
}

export class Grid {
  constructor(size, origin, heading, offset, svg, generations = 0, setLetters = false) {
    this.grid = [];
    this.size = size;
    this.heading = heading;
    this.offset = offset;
    this.directions = [
      this.hex(1, 0, -1),
      this.hex(1, -1, 0),
      this.hex(0, -1, 1),
      this.hex(-1, 0, 1),
      this.hex(-1, 1, 0),
      this.hex(0, 1, -1),
    ];
    this.selectedCount = 0;
    this.originsMap = [];
    this.originPoint = origin;
    this.g = createSVGElement({ fill: "none", stroke: "black", class: "grid", id: "grid" }, "g", svg);
    this.origin = this.add(new Hexagon(this.size, this.originPoint, 0, 0, 0, this, this.heading, this.createG()));
    if (generations > 0) this.addGenerations(generations);
    if (setLetters) this.setLetters();
  }
  add(hexagon) {
    this.grid.push(hexagon);
    this.originsMap.push({ q: hexagon.q, r: hexagon.r, s: hexagon.s });
    return hexagon;
  }

  scale(hexagon, factor) {
    return this.hex(hexagon.q * factor, hexagon.r * factor, hexagon.s * factor);
  }

  addGenerations(generations) {
    const hexNum = 3 * generations * (generations - 1) + 1;
    let generation = 0;
    while (this.grid.length < hexNum) {
      this.grid.forEach((currentHex) => {
        if (
          Math.abs(Math.max(currentHex.q)) == generation ||
          Math.abs(Math.max(currentHex.r)) == generation ||
          Math.abs(Math.max(currentHex.s)) == generation
        ) {
          this.addNeighbours(currentHex);
        }
      });
      generation++;
    }
  }

  addNeighbours(currentHex) {
    this.directions.forEach((dir) => {
      const newHex = this.hexAdd(currentHex, dir);
      const a = Math.max(Math.abs(newHex.q), Math.abs(newHex.r), Math.abs(newHex.s));
      const b = Math.max(Math.abs(currentHex.q), Math.abs(currentHex.r), Math.abs(currentHex.s));
      if (a > b) this.hexNeighbor(newHex);
    });
  }

  hex(q, r, s) {
    if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
    return { q: q, r: r, s: s };
  }

  hexAdd(a, b) {
    return this.hex(a.q + b.q, a.r + b.r, a.s + b.s);
  }

  hexNeighbor(hex) {
    if (!this.originsMap.some((map) => map.q == hex.q && map.r == hex.r && map.s == hex.s)) {
      this.add(new Hexagon(this.size, this.originPoint, hex.q, hex.r, hex.s, this, this.heading, this.createG()));
    }
  }

  createG() {
    const g = createSVGElement({ fill: "none", stroke: "black", class: "highlight" }, "g", this.g);
    g.dataset.selected = false;
    return g;
  }
  async setLetters() {
    const response = await fetch(`http://localhost:3000/api/rndletters/${this.grid.length}`);
    const json = await response.json();
    this.grid.forEach((hex, idx) => {
      hex.letter.innerHTML = json[idx];
    });
  }

  getCell(qrs) {
    for (const cell of this.grid) {
      if (cell.q == qrs.q && cell.r == qrs.r && cell.s == qrs.s) return cell;
    }
    return false;
  }

  getPixels(qrs) {
    return this.getCell(qrs).hexToPixel();
  }
}
