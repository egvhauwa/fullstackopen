import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Table } from 'react-bootstrap';

const UserTable = () => {
  const users = useSelector((state) => state.users);

  const linkStyle = {
    textDecoration: 'none', // Remove underlines
    color: '#0631ce', // Set text color to white
    padding: '0.5rem', // Add padding to the links
  };

  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th> </th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users
            .slice() // users is immutable
            .sort((a, b) => b.blogs.length - a.blogs.length) // Sort by number of blogs in descending order
            .map((user) => (
              <tr key={user.id}>
                <td>
                  <Link style={linkStyle} to={`/users/${user.id}`}>
                    <strong>{user.name}</strong>
                  </Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
