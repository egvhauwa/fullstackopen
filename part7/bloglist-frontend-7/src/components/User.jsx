import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

const User = () => {
  const users = useSelector((state) => state.users);
  const userById = (id) => users.find((a) => a.id === id);
  const match = useMatch('/users/:id');
  const user = match ? userById(match.params.id) : null;

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs
          .slice() // blogs is immutable
          .sort((a, b) => b.likes - a.likes) // Sort by likes in descending order
          .map((blog) => (
            <li key={blog.id}> {blog.title} </li>
          ))}
      </ul>
    </div>
  );
};

export default User;
