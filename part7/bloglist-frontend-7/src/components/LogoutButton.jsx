import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setLoggedUser } from '../reducers/loggedUserReducer';

import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    dispatch(setLoggedUser(null));
    navigate('/login');
  };

  return (
    <Button variant='outline-light' onClick={() => handleLogout()}>
      logout
    </Button>
  );
};

export default LogoutButton;
