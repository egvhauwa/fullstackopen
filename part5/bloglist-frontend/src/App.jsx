import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const LogoutButton = ({ handleLogout }) => (
  <div>
    <button onClick={() => handleLogout()}>logout</button>
  </div>
);

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      console.log(user);

      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception);
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const blogFormRef = useRef();

  const createBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject);
      //Create a shallow copy of the blog object and simultaneously sets the user property
      const populatedBlog = {
        ...blog,
        user: {
          username: user.username,
          name: user.name,
          id: blog.user.id,
        },
      };
      setBlogs(blogs.concat(populatedBlog));
      blogFormRef.current.toggleVisibility();
      setStatusMessage(
        `A new blog ${populatedBlog.title} by ${populatedBlog.auhtor} added`
      );
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setErrorMessage('failed to add blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const updateBlog = async (blogObject, id) => {
    console.log(blogObject);
    console.log(id);
    try {
      const blog = await blogService.update(id, blogObject);
      //Create a shallow copy of the blog object and simultaneously sets the user property
      const populatedBlog = {
        ...blog,
        user: {
          username: user.username,
          name: user.name,
          id: blog.user.id,
        },
      };
      //Replace blog
      setBlogs(
        blogs.map((blog) =>
          blog.id !== populatedBlog.id ? blog : populatedBlog
        )
      );
      setStatusMessage(
        `Blog ${populatedBlog.title} by ${populatedBlog.auhtor} updated`
      );
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setErrorMessage('failed to update blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const removeBlog = async (blogToDelete) => {
    try {
      await blogService.remove(blogToDelete.id);
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      setStatusMessage(
        `Blog ${blogToDelete.title} by ${blogToDelete.author} removed`
      );
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setErrorMessage('failed to remove blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={statusMessage} />
        <Notification message={errorMessage} error />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Bloglist</h2>
      <Notification message={statusMessage} />
      <Notification message={errorMessage} error />
      <p>{user.name} logged in</p>
      <LogoutButton handleLogout={handleLogout} />
      <br />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <h2>Blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes) // Sort by likes in descending order
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
    </div>
  );
};

export default App;
