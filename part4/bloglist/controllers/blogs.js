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
  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  });
  user.blogs = user.blogs.concat(populatedBlog._id);
  await user.save();
  response.status(201).json(populatedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user;
  const blogId = request.params.id;
  const blogToDelete = await Blog.findById(blogId);

  if (!(blogToDelete.user.toString() === user.id.toString())) {
    return response.status(401).json({ error: 'user invalid' });
  }

  await Blog.findByIdAndRemove(blogId);
  // or use: await blog.deleteOne();

  user.blogs = user.blogs.filter(
    (blog) => blog._id.toString() !== blogToDelete._id.toString()
  );
  await user.save();
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
    const populatedBlog = await updatedBlog.populate('user', {
      username: 1,
      name: 1,
    });
    response.json(populatedBlog);
  } else {
    response
      .status(404)
      .send({ error: 'Blog was already deleted from database' });
  }
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body;
  const blogId = request.params.id;
  const blogToComment = await Blog.findById(blogId);
  const comment = body.comment;

  blogToComment.comments = blogToComment.comments.concat(comment);

  const savedBlog = await blogToComment.save();
  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  });
  response.status(201).json(populatedBlog);
});

module.exports = blogsRouter;
