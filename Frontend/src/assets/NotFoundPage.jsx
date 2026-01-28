import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundAnimation from './NotFoundAnimation';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return <NotFoundAnimation onHomeClick={handleHomeClick} />;
};

export default NotFoundPage;
