import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';

import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogsReducer';

const Blog = () => {
  const loggedUser = useSelector((state) => state.loggedUser);

  const blogs = useSelector((state) => state.blogs);
  const blogById = (id) => blogs.find((a) => a.id === id);
  const match = useMatch('/blogs/:id');
  const blog = match ? blogById(match.params.id) : null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const like = () => {
    dispatch(likeBlog(blog));
  };

  const del = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog));
      navigate('/blogs');
    }
  };

  const addComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    dispatch(commentBlog(blog, comment));
    event.target.comment.value = '';
  };

  if (!blog) {
    return null;
  }

  return (
    <div>
      <div className='blog-title-author'>
        <h2>
          {blog.title} {blog.author}
        </h2>
      </div>
      <div className='blog-url'>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div className='blog-likes'>
        {blog.likes} likes <button onClick={like}>like</button>
      </div>
      <div className='blog-user-name'>added by {blog.user.name}</div>
      {loggedUser.username === blog.user.username && ( // Check if the loggedUser is the owner of the blog
        <div>
          <button onClick={del}>delete</button>
        </div>
      )}
      <div className='blog-comments'>
        <h3>comments</h3>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
      <br />
      <form onSubmit={addComment}>
        <div>
          <input type='text' name='comment' id='new-blog-comment' />
        </div>
        <div>
          <button type='submit'>add comment</button>
        </div>
      </form>
    </div>
  );
};

export default Blog;
