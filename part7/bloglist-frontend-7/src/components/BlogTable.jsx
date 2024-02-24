import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Table } from 'react-bootstrap';

const Bloglist = () => {
  const blogs = useSelector((state) => state.blogs);

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
            <th>author</th>
          </tr>
        </thead>
        <tbody>
          {blogs
            .slice() // blogs is immutable
            .sort((a, b) => b.likes - a.likes) // Sort by likes in descending order
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link style={linkStyle} to={`/blogs/${blog.id}`}>
                    <strong>{blog.title}</strong>
                  </Link>
                </td>
                <td>{blog.author}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Bloglist;
