const mongoose= require("mongoose");

const MONGO_URL = "mongodb+srv://sukriti:Mongo123@cluster0.ah4b0pe.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once('open',()=>{
    console.log('mongodb connected');
})
mongoose.connection.on("error",(err)=>{
    console.error(err);
})
async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}
module.exports ={
    mongoConnect,
    mongoDisconnect
}