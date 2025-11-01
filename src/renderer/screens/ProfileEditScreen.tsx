import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Card,
  TitleBar,
  GenderToggle,
  AvatarSelector,
  Modal,
} from '../components';
import { ASSETS } from '../assetPaths';

export const ProfileEditScreen: React.FC = () => {
  const navigate = useNavigate();

  // Mock user data - in a real app, this would come from context/API
  const [userData, setUserData] = useState({
    displayName: 'Player One',
    email: 'player@example.com',
    gender: 'male' as 'male' | 'female',
    avatar: ASSETS.AVATARS.MALE[0],
  });

  const [formData, setFormData] = useState({
    displayName: userData.displayName,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    gender: userData.gender,
    avatar: userData.avatar,
  });

  const [errors, setErrors] = useState<{
    displayName?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const validateForm = () => {
    const newErrors: {
      displayName?: string;
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setUserData({
        ...userData,
        displayName: formData.displayName,
        gender: formData.gender,
        avatar: formData.avatar,
      });
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowPasswordModal(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully!');
    }, 1000);
  };

  const handleGenderChange = (newGender: 'male' | 'female') => {
    setFormData({ ...formData, gender: newGender });
    // Auto-select first avatar of the new gender
    const avatars =
      newGender === 'male' ? ASSETS.AVATARS.MALE : ASSETS.AVATARS.FEMALE;
    setFormData({ ...formData, gender: newGender, avatar: avatars[0] });
  };

  return (
    <div className="screen-container">
      <div className="screen-content">
        <TitleBar
          title="Edit Profile"
          subtitle="Manage your account settings"
          className="mb-6"
        />

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="p-4">
            <h3 className="text-lg font-bold text-white mb-4 luckiest-guy">
              Profile Information
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
              className="space-y-4"
            >
              <Input
                type="text"
                label="Display Name"
                placeholder="Enter your display name"
                value={formData.displayName}
                onChange={(value) =>
                  setFormData({ ...formData, displayName: value })
                }
                error={errors.displayName}
                required
              />

              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={userData.email}
                onChange={() => { }} // Email is read-only in this demo
                disabled
                className="opacity-50"
              />

              <GenderToggle
                selectedGender={formData.gender}
                onGenderChange={handleGenderChange}
              />

              <AvatarSelector
                selectedAvatar={formData.avatar}
                onSelectAvatar={(avatar) =>
                  setFormData({ ...formData, avatar })
                }
                gender={formData.gender}
              />

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </Card>

          {/* Security Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-bold text-white mb-4 luckiest-guy">
              Security Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2 poppins-medium">
                  Password
                </label>
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full"
                >
                  Change Password
                </Button>
              </div>

              <div className="pt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/main-menu')}
                  className="w-full"
                >
                  ← Back to Main Menu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        confirmText="Change Password"
        cancelText="Cancel"
        onConfirm={handleChangePassword}
        onCancel={() => setShowPasswordModal(false)}
      >
        <div className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter your current password"
            value={formData.currentPassword}
            onChange={(value) =>
              setFormData({ ...formData, currentPassword: value })
            }
            error={errors.currentPassword}
            required
          />

          <Input
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={(value) =>
              setFormData({ ...formData, newPassword: value })
            }
            error={errors.newPassword}
            required
          />

          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData({ ...formData, confirmPassword: value })
            }
            error={errors.confirmPassword}
            required
          />
        </div>
      </Modal>
    </div>
  );
};
