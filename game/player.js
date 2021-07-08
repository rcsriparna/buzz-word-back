//Player object factory function
//returns object

export const Player = (name, id) => {
  return {
    name: name,
    score: 0,
    id: id,
    room:null,
    active: false,
  };
};
