const launchesDatabase = require('./launches.mongo'); 

const planets = require('./planets.mongo');


let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27,2030'),
  target :  "Kepler-452 b",
  customer: ['ZTM','NASA'],
  upcoming: true,
  success: true
};






async function getAllLaunches(){
   return await launchesDatabase
   .find({},{ "_id":0, "__v":0});
 }



 async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    console.log(launch.target + " " + planet);
    throw new Error("No matching planet found");
  }

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber
    },
    launch,
    {
      upsert: true
    }
  );
}

 saveLaunch(launch);

 async function getLatestFlightNumber(){
  const latestLaunch = await launchesDatabase
  .findOne()
  .sort('-flightNumber');
   if(!latestLaunch)
      { 
        return DEFAULT_FLIGHT_NUMBER;
      }
   else{
    return latestLaunch.flightNumber;
   } 
   
 }


 async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() +1;

    const newLaunch = Object.assign(launch,{
      success : true,
      upcoming : true,
      customer : ["Zero to Mastery", "Nasa"],
      flightNumber : newFlightNumber
    })

    await saveLaunch(newLaunch)
 }

 async function existsLaunchWithId(LaunchId){
  const flightNumber = Number(LaunchId);
  return await launchesDatabase.findOne({
    flightNumber : LaunchId
  });
}
 async function abortLaunchByID(launchId){
     const aborted =  await launchesDatabase.updateOne({
      flightNumber : launchId
    },{
      success : false,
      upcoming : false
    })
  return aborted.modifiedCount === 1;
 }


module.exports={
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchByID
}