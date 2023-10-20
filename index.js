const express = require(`express`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const cors = require(`cors`);
const {Auth} = require(`./middlewares/Auth`)


const {userModel} = require(`./models/User.model`);
const {Blogmodel} = require(`./models/Blog.model`);
const { connection } = require("mongoose");



const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());


app.post("/signup",async(req,res)=>{
    const{email,password} = req.body;
    try {
        bcrypt.hash(password,5,async function(err,hash){
            await userModel.create({
                email,
                password:hash
            })
            res.send("Account Created Successfully");
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went Wrong");
    }
})

app.post("/login",async(req,res)=>{
    const{email,password} = req.body;
    const user = await userModel.findOne({email});
    if(user){
        const hash = user.password
        bcrypt.compare(password,hash,function(err,result){
            if(result){
                const token = jwt.sign({userId:user._id},"AnmolAnmol");
                res.send({message:"login Success",token:token})
            }
            else{
                res.send("Login Failed");
            }
        })
    }
    else{
        res.send("Email Not found");
    }
})


app.get("/blogs",Auth,(req,res)=>{
    const blog = Blogmodel.find();
    res.send(blog);
})

app.post("/blogs/create",Auth,async(req,res)=>{
    const{title,category,author,content,image} = req.body;
    const author_id = req.userId;
    const blogs = await Blogmodel.create({title,category,author,content,image});
    res.send({message:"blog created",blog:blogs});
})

app.patch(`/blog/:id`,Auth,async(req,res)=>{
    const id = req.params.id;
    const body = req.body;
    const authid = req.userId
    const blog = await Blogmodel.findOne({_id:id});
    if(blog.author_id===authid){
        await Blogmodel.findByIdAndUpdate(id,body);
        res.send({mess:"Blog Updated Success"});
    }
    else{
        res.send({mess:"You are not the owner to update this blog"});
    }
})

app.delete(`/blog/id`,Auth,async(req,res)=>{
    const id = req.params.id;
    const authid = req.userId
    const blog = await Blogmodel.findOne({_id:id});
    if(blog.author_id===authid){
        await Blogmodel.findByIdAndDelete(id);
        res.send({mess:"Blog Deleted Success"});
    }
    else{
        res.send({mess:"You are not the owner to update this blog"});
    }
})

app.listen(8080,async()=>{
    try {
        await connection;
        console.log("connected to port 8080")
    } catch (error) {
        console.log("something went wrong",error)
    }
})