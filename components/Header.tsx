import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg p-4 flex justify-center items-center sticky top-0 z-10">
      <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wider">Photo Mailer</h1>
    </header>
  );
};

export default Header;
