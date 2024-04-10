require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const Blog = require('./models/blog');

const { checkForAuthenticationCookie } = require('./middleware/authentication');

const app = express();

mongoose.connect(process.env.MONGO_URI, { dbName: "BlogPost" })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.set('view engine', 'ejs');
app.set('views', process.cwd() + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home', { user: req.user, blogs: allBlogs });
})

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);


const PORT = process.env.PORT
app.listen(PORT, () => console.log('Server started at PORT: ' + PORT));