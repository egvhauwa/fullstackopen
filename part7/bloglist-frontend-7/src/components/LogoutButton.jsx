import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logoutUser } from '../reducers/loggedUserReducer';

import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <Button variant='outline-light' onClick={() => handleLogout()}>
      logout
    </Button>
  );
};

export default LogoutButton;
