const express = require('express');
const cors = require("cors");
const app=express()  

const PORT = 3000;  

app.use(express.json())  
app.use(cors())          
app.use(express.static(__dirname));  



const connect = async () => {
  
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));  
};

const checkWord = async (req, res, next) => {
  
    try {
         
          
          const word = req.params.word
          
          let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`, {
              method: "GET", headers: {
                   'Accept': 'application/json', 'Content-Type': 'application/json' 
              }                
          })
          let result = await response.json()
console.log(result);








          fetch (!res.member) {
            //if there are no matches ...
            res.status(404).json({ message: "Cannot find member." });
            return 
          }
  
    } catch (e) {
        res.status(500).json({ message: e.message });
          return 
    }
      
    next()  
    
  };

  app.get("/api/:word", checkWord, outputMember);  








connect();
