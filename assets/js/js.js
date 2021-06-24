const join = async () => {
  const inputs = document.querySelectorAll("input");
  const body = [];
  [...inputs].forEach((input) => body.push(input.value));
  const response = await fetch("http://localhost:3000/api/join", {
    method: "POST",
    body: JSON.stringify({ username: body[0], password: body[1] }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
  });
  console.log(await response.json());
};

const login = async () => {
  const inputs = document.querySelectorAll("input");
  const body = [];
  [...inputs].forEach((input) => body.push(input.value));
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ username: body[0], password: body[1] }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
  });
  console.log(await response.json());
  setLetters();
};

const setLetters = async () => {
  const response = await fetch(`http://localhost:3000/api/rndletters/127`, { credentials: "same-origin" });
  const json = await response.json();
  this.grid.forEach((hex, idx) => {
    hex.letter.innerHTML = json[idx];
  });
};
