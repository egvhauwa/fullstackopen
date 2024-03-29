import { useState } from 'react';

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 4,
    paddingLeft: 4,
    paddingBottom: 4,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const likeBlog = () => {
    updateBlog(
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id,
      },
      blog.id
    );
  };

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog);
    }
  };

  if (visible === false) {
    return (
      <div style={blogStyle}>
        <div className='blog-title-author'>
          {blog.title} {blog.author}{' '}
          <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      <div className='blog-title-author'>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>hide</button>
      </div>
      <div className='blog-url'>{blog.url}</div>
      <div className='blog-likes'>
        {blog.likes} <button onClick={likeBlog}>like</button>
      </div>
      <div className='blog-user-name'>{blog.user.name}</div>
      {user.username === blog.user.username && ( // Check if the user is the owner of the blog
        <div>
          <button onClick={deleteBlog}>delete</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
