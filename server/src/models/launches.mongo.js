const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
    flightNumber :{
        type : Number,
        required : true,
        default : 100
    },
    mission :{
        type : String,
        required : true
    },
    rocket :{
        type : String,
        required : true
    },
    launchDate :{
        type : Date,
        required : true
    },
    target :{
        type :String,
        required : true
    },
    customer :[String],

    upcoming :{
        type : Boolean,
        required : true
    },
    success :{
        type : Boolean,
        required : true,
        default :true
    },
})

//Connect LaunchesSchema with "Launches" Collection
module.exports = mongoose.model('Launch',launchesSchema);// model should be singular, as mongoose will lowercase it and plural it to create a model automatically
