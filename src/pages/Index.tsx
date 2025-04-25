import React from 'react';
import AuthSimulator from '../components/AuthSimulator';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <AuthSimulator />
      <Footer />
    </div>
  );
};

export default Index;