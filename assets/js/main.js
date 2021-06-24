//create SVG element
import { Point, Grid, createSVGElement } from "./grid.js";

const svgDiv = document.getElementById("svgDiv");
const svg = createSVGElement({ width: 1600, height: 900, id: "svg" }, "svg", svgDiv);
const size = new Point(35, 35);
const origin = new Point(900, 450);
const grid = new Grid(size, origin, "pointy", 2, svg, 7, true);

console.log(grid);

// let utterance = new SpeechSynthesisUtterance("Hello world! This is a buzz game front-ent made by Adam R");
// speechSynthesis.speak(utterance);
