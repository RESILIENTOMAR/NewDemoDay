const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const moment = require('moment');


module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();

      // Format the createdAt date for each post
      posts.forEach((post) => {
        post.createdAtFormatted = moment(post.createdAt).format("MMM DD, YYYY");
      });

      res.render("community.ejs", { posts: posts, moment: moment });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate("user responses.user");

      res.render("post.ejs", { post: post.toJSON(), user: req.user, moment: moment });
    } catch (err) {
      console.log(err);
    }
  },


  createPost: async (req, res) => {
    try {
      let image = null;
      let cloudinaryId = null;

      // Check if an image was uploaded
      if (req.file) {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
        cloudinaryId = result.public_id;
      }

      const newPost = await Post.create({
        title: req.body.title,
        image: image,
        cloudinaryId: cloudinaryId,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });

      console.log("Post has been added!");
      res.redirect(`/post/${newPost._id}`);
    } catch (err) {
      console.log(err);
    }
  },
  createResponse: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate("user");

      // Create a new response object
      const newResponse = {
        text: req.body.text,
        user: req.user.id, // Assign the user ID to the user field
      };

      // Add the response to the post's responses array
      post.responses.push(newResponse);

      // Save the updated post
      await post.save();

      console.log("Response has been added!");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },


  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;

      // Find the post by ID
      const post = await Post.findById(postId);

      if (!post) {
        console.log("Post not found");
        return res.redirect("/profile");
      }

      // Check if the post has an image in cloudinary
      if (post.cloudinaryId) {
        // Delete the image from cloudinary
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }

      // Delete the post from the database
      await Post.findByIdAndRemove(postId);

      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.redirect("/profile");
    }
  },
};




