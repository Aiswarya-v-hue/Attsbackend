const Db = require('mongoose')
require('dotenv').config()

Db.connect(process.env.MONGO_URL)
.then(()=>{console.log("mongodb connected successfully")
})
.catch((err)=>{console.log("error connecting mongodb",err);
})