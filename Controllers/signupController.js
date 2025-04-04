const getmodel = require('../Models/Signupmodel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');  // ✅ Add this at the top

exports.user = async (req,res)=>{
    const {name,email,password}= req.body;
try{
    
console.log({name,email,password});

if(!name||!email||!password){
    return res.status(400).json({message:"no datas all fields are required"})
}

 const excistinguser =  await getmodel.findOne({email})
    if(excistinguser){
    return res.status(400).json({message:"email already excist",excistinguser})
}

const newuser = new getmodel({name,email,password})

await newuser.save();
console.log(newuser);

return res.status(201).json({message:"user created successfully",newuser})
}catch(err){
    console.error("give detailed error",err)
return res.status(500).json({message:"error creating user",error:err.message})

}
}

exports.userlogin = async(req,res)=>{
try {
    const {email,password}=req.body;
    console.log({email,password});
    
    if(!email||!password){
return res.status(400).json({message:"all fields are required"})
    }
const user =  await getmodel.findOne({email})
console.log(user);

if(!user){
    return res.status(404).json({message:"no user found with this email",user})}
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password)

const ismatch= await bcrypt.compare(password,user.password)
console.log( "passwordmatch:",ismatch);
if(!ismatch){
    return res.status(401).json({message:"password incorrect ",ismatch})
}


const token = jwt.sign({userId:user._id},'your_secret_key',{expiresIn:'10h'})
console.log("generated token",token);

res.status(201).json({message:'login successfull',token,data:user})
} catch (error) {
   res.status(500).json({error:"server error",detail:error.message})
    

}
} // Adjust the path as necessary

exports.getUser = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    console.log(authHeader);
    
    const token = authHeader.split(' ')[1];
console.log(token);

    // Verify and decode the token
    const decoded = jwt.verify(token, 'your_secret_key'); // Ensure you have JWT_SECRET in your environment variables

    // Retrieve the user from the database using the decoded user ID
    const existingUser = await getmodel.findById(decoded.userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
console.log(existingUser);

    // Return the user details
    return res.status(200).json({ message: 'User details retrieved successfully', user: existingUser });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
