import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, TitleBar, GenderToggle, AvatarSelector } from '../components';
import { ASSETS } from '../assetPaths';

export const RegistrationProfileEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(ASSETS.AVATARS.MALE[0]);
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
    // Auto-select first avatar of the new gender
    const avatars = newGender === 'male' ? ASSETS.AVATARS.MALE : ASSETS.AVATARS.FEMALE;
    setSelectedAvatar(avatars[0]);
  };

  const handleComplete = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/main-menu');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <TitleBar 
          title="Complete Your Profile" 
          subtitle="Tell us about yourself to personalize your experience"
        />
        
        <form onSubmit={(e) => { e.preventDefault(); handleComplete(); }} className="space-y-8">
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
          
          <div className="flex gap-4 pt-4">
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
  );
};
