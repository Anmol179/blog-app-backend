const mongoose = require(`mongoose`);

const blogSchema = mongoose.Schema({
    title:{type:String,required:true},
    category:{type:String,required:true},
    author:{type:String,required:true},
    content:{type:String,required:true},
    image:{type:String,required:false},
    author_id:{type:String,required:true}
})

const Blogmodel = mongoose.model("blog",blogSchema);

module.exports = {Blogmodel}