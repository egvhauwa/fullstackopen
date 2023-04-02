import { useState } from 'react';

const Header = ({ name }) => {
  console.log(name);
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

const Anecdote = ({ anecdote }) => {
  console.log(anecdote);
  return <div>{anecdote}</div>;
};

const Votes = ({ points }) => {
  console.log(points);
  return <div>has {points} votes</div>;
};

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  console.log('Rendering App component');

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Uint32Array(anecdotes.length));
  const [mostVoted, setMostVoted] = useState(0);

  const handleVoteClick = () => {
    console.log('vote clicked');
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
    if (copy[selected] > points[mostVoted]) {
      setMostVoted(selected);
    }
  };

  const handleNextClick = () => {
    console.log('next clicked');
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    console.log(randomIndex);
    setSelected(randomIndex);
  };

  return (
    <div>
      <Header name='Anecdote of the day' />
      <Anecdote anecdote={anecdotes[selected]} />
      <Votes points={points[selected]} />
      <Button handleClick={handleVoteClick} text='vote' />
      <Button handleClick={handleNextClick} text='next anecdote' />
      <Header name='Anecdote with most votes' />
      <Anecdote anecdote={anecdotes[mostVoted]} />
    </div>
  );
};

export default App;
