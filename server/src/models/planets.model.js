const {parse} = require('csv-parse');
const { resolve } = require('dns');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');
const { get } = require('../routes/planets/planets.router');

const habitablePlanet=[];
function isHabitable(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol']>0.36 && planet['koi_insol']<1.11
    && planet['koi_prad']<1.6; 
}
function loadPlanetsData(){
   
    return new Promise((resolve,reject)=>{
        // learn stream to promise api, to directly convert stream data to promise object 
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))// this will return stream which node js can't resolve so we'll return a promise object
         .pipe(parse({
            comment:'#',
            columns:true
         }))
        .on('data',async (data)=>{
            //TODO: replace this with upsert
            //this fxn is called in main file multi time creating multi entries so mongo provide upsert(insert+update) method
            if(isHabitable(data)){
               savePlanet(data.kepler_name);
            }
            
        })
        .on('error',(err)=>{
            console.log(err);
            reject(err);
        })
        .on('end',async ()=>{
            const countPlanetFound = (await getAllPlanets()).length;
            console.log(`${countPlanetFound} number of planets are found`);
            resolve();//call resolve function when we done with parsing our data
        });
    }) 
}
   async function getAllPlanets(){
    return  await planets.find({},{
        "_id":0,"__v":0 // we can exclude unwanted fields
    });
   }

   async function savePlanet(planet){
    try{
        await planets.updateOne({
            keplerName : planet.kepler_name //update if exist
        },{
            keplerName : planet.kepler_name // if not add it
        },{
            upsert :true // this ensure upsert fxn
        })
    }
    catch(err){
        console.log(`cannot update because of ${err}`);
    }
   }

    module.exports={
        loadPlanetsData,
        getAllPlanets,
    };