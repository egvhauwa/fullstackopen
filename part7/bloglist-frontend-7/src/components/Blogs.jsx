import { useRef } from 'react';

import Togglable from '../components/Togglable';
import BlogForm from '../components/BlogForm';
import BlogTable from './BlogTable';

const Blogs = () => {
  const blogFormRef = useRef();

  return (
    <div>
      <br />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm
          toggleVisibility={() => blogFormRef.current.toggleVisibility()}
        />
      </Togglable>
      <BlogTable />
    </div>
  );
};

export default Blogs;
