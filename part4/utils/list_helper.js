const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const blogWithMostLikes = blogs.reduce((favorite, currentBlog) => {
    return currentBlog.likes > favorite.likes ? currentBlog : favorite;
  });
  return {
    title: blogWithMostLikes.title,
    author: blogWithMostLikes.author,
    likes: blogWithMostLikes.likes,
  };
};

function mostBlogs(blogs) {
  if (blogs.length === 0) {
    return {};
  }
  const blogCount = _.countBy(blogs, 'author');
  const maxAuthor = _.maxBy(_.keys(blogCount), (author) => blogCount[author]);
  return {
    author: maxAuthor,
    blogs: blogCount[maxAuthor],
  };
}

function mostLikes(blogs) {
  if (blogs.length === 0) {
    return {};
  }
  const likesByAuthor = _.groupBy(blogs, 'author');
  const authorsWithMostLikes = _.mapValues(likesByAuthor, (authorBlogs) =>
    _.sumBy(authorBlogs, 'likes')
  );
  const maxAuthor = _.maxBy(
    _.keys(authorsWithMostLikes),
    (author) => authorsWithMostLikes[author]
  );
  return {
    author: maxAuthor,
    likes: authorsWithMostLikes[maxAuthor],
  };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
