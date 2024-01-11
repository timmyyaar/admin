import React from 'react';

import './style.css';

export const Louder = ({ visible = false }) => {
  return visible ? (
    <div className="_fixed _top-0 _left-0 _w-full _h-full _flex _items-center _justify-center _bg-gray-800 _bg-opacity-50 _z-50">
      <div className="_loader _flex _items-center _justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 512 512">
        <path fill="#f0f2f5" d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/>
      </svg>
      </div>
    </div>
  ) : null;
};
