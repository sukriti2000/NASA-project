const {getAllPlanets}=require('../../models/planets.model');
async function httpGetAllPlanets(req,res){
   return res.status(200).json(await getAllPlanets());//return method is good for the project to debug later
   // plus it makes sure that response is set only once even if called multiple times
}

module.exports={
    httpGetAllPlanets,
};