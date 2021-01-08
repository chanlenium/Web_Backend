var mongoose = require("mongoose");
var Schema = mongoose.Schema;

require('dotenv').config(); // for reaging the .env file

// connect to the localhost MongoDB running on default port 27017
// mongoose.connect("mongodb://localhost/web322", {useNewUrlParser: true, useUnifiedTopology: true});

// connect to MongoDB on cloud - MongoDB Altas using connection string (see the .env file)
mongoose.connect(process.env.MONGODB_CONN_STR, {useNewUrlParser: true, useUnifiedTopology: true});

const commentSchema = new Schema({
    comment: String,
    author: String,
    date: Date
});

commentSchema.add({ comments: [commentSchema] });

var Comment = mongoose.model("comments", commentSchema);//

var commentChain = new Comment({
    comment: "Star Wars is awesome",
    author: "Author 1",
    date: new Date(),
    comments: [{
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
    if(err) {
      console.log("There was an error saving the commentChain comment");
    } else {
      console.log("The commentChain comment was saved to the web322_companies collection");
    }
    // exit the program after saving
    process.exit();
});
