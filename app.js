//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Hi there! Catch the latest news on business, sport and technological evolution happening all across the globe here. ";
const newsStartingContent = "Breaking  News - Leading World Newspaper - Top News from Nigeria, Africa and the world.";
const contactContent = "To hire me, fill the form below to send a mail and connect with me on the media platforms below. I enjoy working with dedicated creatives from businesses that make the world beautiful.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sam:test123@cluster0.gk8tj.mongodb.net/blogDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
app.get("/", function(req, res){
  res.render("home", {
    homeContent: homeStartingContent,
  });
});

app.get("/news", function(req, res) {

  Post.find({}, function(err, foundPosts) {
    res.render("news", {
      newsContent: newsStartingContent,
      posts: foundPosts
    });
  });
});
// Post.deleteOne({title: "Lionel Messi leads Argentina to win Finalissima trophy"}, function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("successfuly deleted");
//   }
// });

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});


app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server started on port 3000");
});
