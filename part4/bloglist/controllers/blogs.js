const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
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
