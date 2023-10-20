const jwt = require(`jsonwebtoken`);

const Auth = (req,res,next)=>{
    const token = req.header.authorization.split(" ")[1];
    jwt.verify(token,"AnmolAnmol",function(err,decoded){
        if(err){
            res.send("User Not logined")
        }
        else{
            req.authid = decoded.userID;
            next();
        }
    })
}

module.exports = {Auth}