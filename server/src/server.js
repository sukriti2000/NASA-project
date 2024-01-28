// yahan pr express vali file aur http server vali file alag ki h
const http = require("http");
const app = require('./app');

const { mongoConnect } = require('./services/mongo');
//1. in client folder already port is provided
//so to solve the conflict we'll provide another port like 8000
//as there are two folder , node also have to configure which port it should run
//we'll provide the choice like:
// we are taking port from the environment if present by default otherwise 
//over hard coded port will be used:8000
//process.env.PORT - we have to set it in package.json in the script section
const PORT = process.env.PORT || 8000;
const {loadPlanetsData}= require('./models/planets.model');
const {error} = require("console");


const server=http.createServer(app);



async function startServer(){
   await mongoConnect();
    await loadPlanetsData();
    // loadPlanetsData is a function in planets model , and await can only run in async function 
    //that's why we wrote startServer function as async function and called it at the end
server.listen(PORT,()=>{
console.log(`app is listening on PORT ${PORT}`);
});
}
startServer();