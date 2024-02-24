import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('<BlogForm /> same user', () => {
  const createBlog = jest.fn();

  let container;

  beforeEach(() => {
    container = render(<BlogForm createBlog={createBlog} />).container;
  });

  test('create', async () => {
    const user = userEvent.setup();

    const titleInput = container.querySelector('#new-blog-title');
    await user.type(titleInput, 'test_title');
    const authorInput = container.querySelector('#new-blog-author');
    await user.type(authorInput, 'test_author');
    const urlInput = container.querySelector('#new-blog-url');
    await user.type(urlInput, 'test_url');

    const createButton = screen.getByText('create');
    await user.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('test_title'); //[0][0] first call, first argument
    expect(createBlog.mock.calls[0][0].author).toBe('test_author');
    expect(createBlog.mock.calls[0][0].url).toBe('test_url');
  });
});
