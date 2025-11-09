import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Card,
  TitleBar,
  GenderToggle,
  AvatarSelector,
} from '../components';
import { ASSETS } from '../assetPaths';
import { UserAdapter } from '../adapters/userAdapter';
import { useAuth } from '../contexts/UserContext';

export const RegistrationProfileEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    ASSETS.AVATARS.MALE[0]
  );
  const [errors, setErrors] = useState<{ displayName?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { displayName?: string } = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenderChange = (newGender: 'male' | 'female') => {
    setGender(newGender);
    const avatars =
      newGender === 'male' ? ASSETS.AVATARS.MALE : ASSETS.AVATARS.FEMALE;
    setSelectedAvatar(avatars[0]);
  };

  const handleComplete = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const tempUserStr = sessionStorage.getItem('temp_user');
      if (!tempUserStr) {
        throw new Error('User session not found. Please register again.');
      }

      const tempUser = JSON.parse(tempUserStr);

      let session: any = null;
      const tempSessionStr = sessionStorage.getItem('temp_session');
      if (tempSessionStr) {
        try {
          session = JSON.parse(tempSessionStr);
        } catch (e) {
          console.warn('Failed to parse temp session');
        }
      }

      if (!session) {
        session = await UserAdapter.getSession();
      }

      const sessionForUpdate = session
        ? {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        }
        : undefined;

      console.log(
        'Updating profile with userId:',
        tempUser.id,
        'session:',
        sessionForUpdate ? 'present' : 'missing'
      );

      await UserAdapter.updateProfile(
        tempUser.id,
        {
          display_name: displayName,
          gender: gender,
          avatar: selectedAvatar,
        },
        sessionForUpdate
      );

      session = await UserAdapter.getSession();
      if (session) {
        localStorage.setItem('session', JSON.stringify(session));
        localStorage.setItem('user', JSON.stringify(tempUser));
      }

      sessionStorage.removeItem('temp_user');
      sessionStorage.removeItem('temp_session');

      await refreshSession();
      navigate('/main-menu');
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({
        displayName:
          error instanceof Error ? error.message : 'Profile creation failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-content">
        <Card className="w-full p-6">
          <TitleBar
            title="Complete Your Profile"
            subtitle="Tell us about yourself to personalize your experience"
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleComplete();
            }}
            className="space-y-6"
          >
            <Input
              type="text"
              label="Display Name"
              placeholder="Enter your display name"
              value={displayName}
              onChange={setDisplayName}
              error={errors.displayName}
              required
            />

            <GenderToggle
              selectedGender={gender}
              onGenderChange={handleGenderChange}
            />

            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelectAvatar={setSelectedAvatar}
              gender={gender}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating Profile...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
