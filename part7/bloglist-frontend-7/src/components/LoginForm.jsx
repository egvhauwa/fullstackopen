import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import loginService from '../services/login';
import blogService from '../services/blogs';

import { setLoggedUser } from '../reducers/loggedUserReducer';
import { setError } from '../reducers/notificationReducer';

import { Form, Button } from 'react-bootstrap';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    try {
      const loggedUser = await loginService.login({ username, password });
      console.log(loggedUser);
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      dispatch(setLoggedUser(loggedUser));
      blogService.setToken(loggedUser.token);
      navigate('/');
    } catch (exception) {
      console.log(exception);
      dispatch(setError('wrong credentials'));
      event.target.password.value = '';
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
