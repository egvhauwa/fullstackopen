import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((store) => store.notification);

  if (notification === null) {
    return null;
  }

  const className = `notification${
    notification.error ? ' notification-error' : ''
  }`;

  return <div className={className}>{notification.content}</div>;
};

export default Notification;
