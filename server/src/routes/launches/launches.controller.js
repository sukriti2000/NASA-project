const {getAllLaunches,scheduleNewLaunch,existsLaunchWithId,abortLaunchByID} = require('../../models/launches.model');

// as we are using maps here and we need to pass json object
// that's why we'll filter out the values in the map
async function httpGetAllLaunches(req, res) {
  const allLaunches = await getAllLaunches();
  return res.status(200).json(allLaunches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
  
    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
      return res.status(400).json({
        err: "Missing required launch properties",
      });
    }
  
    const parsedLaunchDate = new Date(launch.launchDate);
    if (isNaN(parsedLaunchDate)) {
      return res.status(400).json({
        err: "Invalid launch date",
      });
    }
    launch.launchDate = parsedLaunchDate;
  
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
  }
  
  async function httpAbortLaunch(req,res){
    const launchId = req.params.id;
    const existLaunch = await existsLaunchWithId(launchId);
    if(!existLaunch){
        return res.status(404).json({
            err:"id doesn't exist"
        })
    }
    const aborted = await abortLaunchByID(launchId);
    if(!aborted){
      return res.status(400).json({
        error : "Launch not aborted"
      });
    }
    return res.status(200).json({
      ok : true
    });
  }
module.exports={
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}