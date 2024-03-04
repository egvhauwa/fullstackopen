import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';

import { initializeLoggedUser } from './reducers/loggedUserReducer';
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
  const dispatch = useDispatch();

  const loggedUser = useSelector((state) => state.loggedUser);

  useEffect(() => {
    dispatch(initializeUsers());
    dispatch(initializeBlogs());
    dispatch(initializeLoggedUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loggedUser) {
    return (
      <div className='container'>
        <h2>Login</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <div className='container'>
      <Menu />
      <Notification />
      <br />
      <Routes>
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
