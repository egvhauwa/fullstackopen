import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Togglable /> same user', () => {
  const blog = {
    title: 'test_blog',
    author: 'test_author',
    url: 'test_url',
    likes: 0,
    user: {
      username: 'test_user_username',
      name: 'test_user_name',
      id: 'test_user_id',
    },
    id: 'test_id',
  };
  const updateBlog = jest.fn();
  const removeBlog = jest.fn();
  const user = {
    username: 'test_user_username',
    name: 'test_user_name',
    id: 'test_user_id',
  };

  let container;

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        removeBlog={removeBlog}
        user={user}
      />
    ).container;
  });

  test('renders title and author, but not url and likes', () => {
    const titleAuthor = container.querySelector('.blog-title-author');
    expect(titleAuthor).toBeDefined();
    const url = container.querySelector('.blog-url');
    expect(url).toBeNull();
    const likes = container.querySelector('.blog-likes');
    expect(likes).toBeNull();
  });

  test('view url and likes', async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const titleAuthor = container.querySelector('.blog-title-author');
    expect(titleAuthor).toBeDefined();
    const url = container.querySelector('.blog-url');
    expect(url).toBeDefined();
    const likes = container.querySelector('.blog-likes');
    expect(likes).toBeDefined();
  });

  test('like', async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(updateBlog.mock.calls).toHaveLength(2);
  });
});
