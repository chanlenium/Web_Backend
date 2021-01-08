// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect to the localhost mongo running on default port
//mongoose.connect("mongodb://localhost/web322");
// connect to the remote mongo server (Atlas cloud)
mongoose.connect("mongodb+srv://dcoh:Ss5170148!@senecaweb.megxd.mongodb.net/web322_week8?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})

// define the commentSchema schema
const commentSchema = new Schema({
    comment: String,
    author: String,
    date: Date
});

// add a “comments” field with a type of “[commentSchema]” to the original “commentSchema”
commentSchema.add({comments: [commentSchema]});

// make "comments" model (comments Table을 만듦)
var Comment = mongoose.model("comments", commentSchema);

var commentChain = new Comment({
    comment: "Star Wars is awesome",
    author: "Author 1",
    date: new Date(),
    comments:[{
        comment: "I agree",
        author: "Author 2",
        date: new Date(),
        comments: [{
            comment: "I agree with Author 2",
            author: "Author 3",
            date: new Date(),
            comments: []
        }]
    }]
});

commentChain.save((err) => {
    if(err){
        console.log("There was an error saving the commentChain comment");
    }else{
        console.log("The commentChain comment was saved to the comments collection");
    } 
    //exit after saving
    process.exit();
});