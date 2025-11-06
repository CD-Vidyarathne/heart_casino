import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, TitleBar } from '../components';
import { AuthAdapter } from '../adapters/authAdapter';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { session, user } = await AuthAdapter.signIn(email, password);

      if (session) {
        localStorage.setItem('session', JSON.stringify(session));
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Refresh auth context to update state
      // Use a small delay to ensure state updates before navigation
      await refreshSession();
      
      // Wait a bit for the auth context to update
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      navigate('/main-menu');
    } catch (error) {
      setErrors({
        password: error instanceof Error ? error.message : 'Login failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="screen-container">
      <div className="screen-content flex items-center justify-center">
        <Card className="w-full p-6">
          <TitleBar
            title="Welcome Back!"
            subtitle="Sign in to your casino account"
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-300 mb-3 text-sm poppins">
              Don't have an account?
            </p>
            <Button
              variant="secondary"
              onClick={handleRegister}
              className="w-full"
            >
              Create New Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
