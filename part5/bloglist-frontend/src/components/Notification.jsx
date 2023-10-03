const Notification = ({ message, error }) => {
  if (message === null) {
    return null;
  }

  const className = `notification${error ? ' notification-error' : ''}`;

  return <div className={className}>{message}</div>;
};

export default Notification;
