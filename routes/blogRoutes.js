const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Blog = require('../models/blog');
const Comment = require('../models/commentModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create a folder path using the user's ID
        const folderPath = path.resolve(`./public/uploads/${req.user._id}`);

        // Create the folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        // Set the folder path as the destination for the file
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Middleware function to check authentication
function requireAuth(req, res, next) {
    // Check if user is authenticated
    if (!req.user) {
        // If not authenticated, redirect to login page or display error message
        return res.redirect('/user/login'); // Redirect to login page
    }
    // If authenticated, proceed to next middleware or route handler
    next();
}

router.get('/add-blog', requireAuth, (req, res) => {
    return res.render('addBlog', { user: req.user });
});

router.post('/', upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageUrl: `/uploads/${req.user._id}/${req.file.filename}`,
        createdBy: req.user._id,
    });
    // console.log(req.file)
    return res.redirect(`/blog/${blog._id}`);
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById({ _id: req.params.id }).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    res.render('blogPage', {
        user: req.user,
        blog,
        comments,
    });
    //  console.log(blog.createdBy)
});

router.post('/comment/:blogId', async (req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
})


module.exports = router;