import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../reducers/loggedUserReducer';

import { Form, Button } from 'react-bootstrap';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    dispatch(loginUser({ username, password }));
    event.target.password.value = '';
    navigate('/');
  };

  return (
    <div>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control type='text' name='username' />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control type='password' name='password' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          login
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
