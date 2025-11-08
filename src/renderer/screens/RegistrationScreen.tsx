import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, TitleBar } from '../components';
import { AuthAdapter } from '../adapters/userAdapter';

export const RegistrationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const signUpResponse = await AuthAdapter.signUp(email, password);

      // Store both user and session if available
      if (signUpResponse?.user) {
        sessionStorage.setItem(
          'temp_user',
          JSON.stringify(signUpResponse.user)
        );
      }

      // Store session if available (Supabase might auto-sign in after signup)
      if (signUpResponse?.session) {
        sessionStorage.setItem(
          'temp_session',
          JSON.stringify(signUpResponse.session)
        );
        localStorage.setItem('session', JSON.stringify(signUpResponse.session));
        localStorage.setItem('user', JSON.stringify(signUpResponse.user));
      }

      navigate('/register-profile');
    } catch (error) {
      setErrors({
        email: error instanceof Error ? error.message : 'Registration failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="screen-container">
      <div className="screen-content flex items-center justify-center">
        <Card className="w-full p-6">
          <TitleBar
            title="Join the Casino!"
            subtitle="Create your account to start playing"
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
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
              placeholder="Create a password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-300 mb-3 text-sm poppins">
              Already have an account?
            </p>
            <Button
              variant="secondary"
              onClick={handleLogin}
              className="w-full"
            >
              Sign In Instead
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
