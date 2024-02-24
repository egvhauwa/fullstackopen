import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { addBlog } from '../reducers/blogsReducer';

import { Form, Button } from 'react-bootstrap';

const BlogForm = ({ toggleVisibility }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createBlog = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;
    dispatch(addBlog({ title, author, url }));
    toggleVisibility();
    event.target.title.value = '';
    event.target.author.value = '';
    event.target.url.value = '';
    navigate('/blogs');
  };

  const buttonStyle = {
    backgroundColor: '#0631ce', // Replace with your custom color
    borderColor: '#0631ce', // Replace with your custom border color if needed
    color: 'white', // Replace with your custom text color
  };

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={createBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control type='text' name='title' id='new-blog-title' />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control type='text' name='author' id='new-blog-author' />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control type='url' name='url' id='new-blog-url' />
        </Form.Group>
        <Button style={buttonStyle} variant='primary' type='submit'>
          create
        </Button>
      </Form>
    </div>
  );
};

export default BlogForm;
