const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const redis = require('redis')
const util = require('util')

const Blog = mongoose.model('Blog');

const redisUrl = "redis://127.0.0.1:6379"

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const client = redis.createClient(redisUrl)
    client.get = util.promisify(client.get)
    // Do we have any cached data in redis related 
    // to this query
    const cachedBlogs = await client.get(req.user.id)

    // if yes, then responde to the request right away 
    // and return 
    if (cachedBlogs && JSON.parse(cachedBlogs).length ) {
      console.log('Serving from cache');
      return res.send (JSON.parse(cachedBlogs))
    }

    // if no, we need to responde to request 
    // and update our cache to store the data
    const blogs = await Blog.find({ _user: req.user.id });
    console.log("Serving from Mongodb");
    
    res.send(blogs);

    // set blogs into redis cache
    client.set(req.user.id, JSON.stringify(blogs));


  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
