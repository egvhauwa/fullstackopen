import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import blogService from './services/blogs';

import { setLoggedUser } from './reducers/loggedUserReducer';
import { initializeUsers } from './reducers/usersReducer';
import { initializeBlogs } from './reducers/blogsReducer';

import { Navbar, Nav, Container } from 'react-bootstrap';
import Blogs from './components/Blogs';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import UserTable from './components/UserTable';
import User from './components/User';

const Menu = () => {
  // https://react-bootstrap.netlify.app/docs/components/navbar/
  const loggedUser = useSelector((state) => state.loggedUser);

  const linkStyle = {
    textDecoration: 'none', // Remove underlines
    color: 'white', // Set text color to white
    padding: '0.5rem', // Add padding to the links
  };

  const padding = {
    // paddingLeft: 5,
    paddingRight: '0.5rem',
  };

  return (
    <div>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand className='fw-bold'>
            <Nav.Link href='#' as='span'>
              <Link style={linkStyle} to='/'>
                Bloglist
              </Link>
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link href='#' as='span'>
                <Link style={linkStyle} to='/blogs'>
                  blogs
                </Link>
              </Nav.Link>
              <Nav.Link href='#' as='span'>
                <Link style={linkStyle} to='/users'>
                  users
                </Link>
              </Nav.Link>
            </Nav>
            <Navbar.Text style={padding}>
              {loggedUser.name} logged in
            </Navbar.Text>
            <LogoutButton />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const loggedUser = useSelector((state) => state.loggedUser);

  useEffect(() => {
    dispatch(initializeUsers());
    dispatch(initializeBlogs());
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setLoggedUser(user));
      blogService.setToken(user.token);
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className='container'>
      {loggedUser && <Menu />}
      <Notification />

      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/' element={<Blogs />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blogs/:id' element={<Blog />} />
        <Route path='/users' element={<UserTable />} />
        <Route path='/users/:id' element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
