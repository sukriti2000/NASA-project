//express vali middleware alag rkhne k liye humne express ki files alag krdi hhein
const express = require("express");
const path = require('path');
const app = express();
const cors=require("cors");
const morgan = require('morgan');

app.use(cors({
    origin:"http://localhost:3000"
}))
app.use(morgan('combined')); //substitute of console.log for debugging

const planetsRouter=require('./routes/planets/planets.router');
const launchesRouter= require('./routes/launches/launches.router');


app.use(express.json()); // express.json is a express middleware to parse any json object coming as request/response
app.use(express.static(path.join(__dirname,'..','public')));

app.use('/planets',planetsRouter);
app.use('/launches',launchesRouter);

// using *  , which lets express to match every other router that has not been found above, it send router to index.html if found nothing
app.use('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})

module.exports=app;
