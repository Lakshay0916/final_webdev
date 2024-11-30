let mongoose = require('mongoose')

let db = "mongodb+srv://gauravghosh24005:NLLGlc4hVR7u2SMn@medicine.o15y9.mongodb.net/?retryWrites=true&w=majority&appName=Medicine"
let dbconnect=()=>{
    try{
        mongoose.connect(db,{})
        console.log("Database connected successfully")
    }
    catch(err){
        console.log("Error connecting to the database: ",err)
    }


    }



module.exports=dbconnect;


