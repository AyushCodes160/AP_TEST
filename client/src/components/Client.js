import React from 'react';
import Avatar from 'react-avatar';

function Client({username}) {
  const displayName = username || 'Anonymous';

  return (
    <div className="d-flex align-items-center mb-3">
      <Avatar name={displayName} size={50} round="14px" className="mr-3" />
      <span className='mx-2'>{displayName}</span>
    </div>
  );
}

export default Client;
