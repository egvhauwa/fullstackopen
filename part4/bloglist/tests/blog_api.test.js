const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    expect(blogs[0].id).toBeDefined();
  });
});

describe('addition of a new blog', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('succeeds with valid data', async () => {
    const login = {
      username: 'root',
      password: 'secret',
    };

    const loginResp = await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const token = 'Bearer ' + loginResp.body.token;

    const usersAtEnd = await helper.usersInDb();
    const addedUser = usersAtEnd.find(
      (user) => user.username === login.username
    );

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'fullstack open',
      url: 'https://fullstackopen.com/en/',
      likes: 1,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({
        Authorization: token,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
    expect(addedBlog.title).toEqual(newBlog.title);
    expect(addedBlog.author).toEqual(newBlog.author);
    expect(addedBlog.url).toEqual(newBlog.url);
    expect(addedBlog.likes).toEqual(newBlog.likes);
    expect(addedBlog.user.toString()).toEqual(addedUser.id);
  });

  test('succeeds when the likes property is missing', async () => {
    const login = {
      username: 'root',
      password: 'secret',
    };

    const loginResp = await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const token = 'Bearer ' + loginResp.body.token;

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'fullstack open',
      url: 'https://fullstackopen.com/en/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({
        Authorization: token,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
    expect(addedBlog.likes).toEqual(0);
  });

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'fullstack open',
      url: 'https://fullstackopen.com/en/',
      likes: 1,
      userId: '64b2a4334dca97aa7266c8b3',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'fullstack open',
      likes: 1,
      userId: '64b2a4334dca97aa7266c8b3',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('succeeds with status code 204 if id and token is valid', async () => {
    const login = {
      username: 'root',
      password: 'secret',
    };

    const loginResp = await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const token = 'Bearer ' + loginResp.body.token;

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'fullstack open',
      url: 'https://fullstackopen.com/en/',
      likes: 1,
    };

    const blogsPostResp = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({
        Authorization: token,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const addedBlog = blogsPostResp.body;

    const currentBlogs = await helper.blogsInDb();
    expect(currentBlogs).toHaveLength(helper.initialBlogs.length + 1);

    await api
      .delete(`/api/blogs/${addedBlog.id}`)
      .set({
        Authorization: token,
      })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).not.toContain(newBlog.title);
  });
});

describe('update of a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.likes += 1;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.title === blogToUpdate.title
    );
    expect(updatedBlog.title).toEqual(blogToUpdate.title);
    expect(updatedBlog.author).toEqual(blogToUpdate.author);
    expect(updatedBlog.url).toEqual(blogToUpdate.url);
    expect(updatedBlog.likes).toEqual(blogToUpdate.likes);
  });

  test('fails with status code 400 if likes is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.likes = 'invalid';

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is not long enough', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'pw',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'Password must be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
