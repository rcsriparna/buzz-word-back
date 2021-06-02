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

connect();