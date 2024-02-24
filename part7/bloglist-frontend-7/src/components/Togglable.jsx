import { useState, useImperativeHandle, forwardRef } from 'react';

import { Button } from 'react-bootstrap';

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  const buttonStyle = {
    backgroundColor: '#0631ce', // Replace with your custom color
    borderColor: '#0631ce', // Replace with your custom border color if needed
    color: 'white', // Replace with your custom text color
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button style={buttonStyle} onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button style={buttonStyle} onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

export default Togglable;
