const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

const userExtractor = middleware.userExtractor;

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!(blog.user.toString() === user.id.toString())) {
    return response.status(401).json({ error: 'user invalid' });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const options = {
    new: true,
    runValidators: true,
    context: 'query',
  };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    options
  );
  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response
      .status(404)
      .send({ error: 'Blog was already deleted from database' });
  }
});

module.exports = blogsRouter;
