import React from 'react';
import { SignupForm } from '../features/auth/components/SignupForm';

export const SignupPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <SignupForm />
    </div>
  );
};
