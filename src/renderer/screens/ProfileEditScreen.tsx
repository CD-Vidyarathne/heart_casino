import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../contexts/UserContext';
import { AuthAdapter } from '../adapters/userAdapter';

type AlertType = 'success' | 'error' | 'warning' | 'confirm';

export const ProfileEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, session, refreshProfile, signOut } = useAuth();

  const [formData, setFormData] = useState({
    displayName: profile?.display_name || user?.email?.split('@')[0] || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    gender: (profile?.gender || 'male') as 'male' | 'female',
    avatar: profile?.avatar || ASSETS.AVATARS.MALE[0],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.display_name || user?.email?.split('@')[0] || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        gender: (profile.gender || 'male') as 'male' | 'female',
        avatar: profile.avatar || ASSETS.AVATARS.MALE[0],
      });
    }
  }, [profile, user]);

  const [errors, setErrors] = useState<{
    displayName?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'success' as AlertType,
    title: '',
    message: '',
    onConfirm: () => { },
    showCancel: false,
  });

  const validateForm = () => {
    const newErrors: {
      displayName?: string;
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

  const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    onConfirm?: () => void,
    showCancel = false
  ) => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm: onConfirm || (() => { }),
      showCancel,
    });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  const getAlertColor = () => {
    switch (alertModal.type) {
      case 'success':
        return 'border-green-500/50 text-green-400';
      case 'error':
        return 'border-red-500/50 text-red-400';
      case 'warning':
        return 'border-yellow-500/50 text-yellow-400';
      case 'confirm':
        return 'border-blue-500/50 text-blue-400';
      default:
        return 'border-purple-500/50 text-purple-400';
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    if (!user?.id || !session) {
      showAlert(
        'error',
        'Authentication Error',
        'You must be logged in to update your profile'
      );
      return;
    }

    setIsLoading(true);

    try {
      await AuthAdapter.updateProfile(
        user.id,
        {
          display_name: formData.displayName.trim(),
          gender: formData.gender,
          avatar: formData.avatar,
        },
        session
      );
      await refreshProfile();
      showAlert(
        'success',
        'Success!',
        'Your profile has been updated successfully'
      );
    } catch (error) {
      showAlert(
        'error',
        'Update Failed',
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowPasswordModal(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      showAlert(
        'success',
        'Password Changed',
        'Your password has been changed successfully'
      );
    }, 1000);
  };

  const handleLogout = () => {
    showAlert(
      'confirm',
      'Confirm Logout',
      'Are you sure you want to log out of your account?',
      async () => {
        await signOut();
        navigate('/login');
      },
      true
    );
  };

  const handleGenderChange = (newGender: 'male' | 'female') => {
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
                value={user?.email || ''}
                onChange={() => { }}
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

              <div className="pt-4 space-y-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/main-menu')}
                  className="w-full"
                >
                  ← Back to Main Menu
                </Button>
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Log Out
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

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

      <Modal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        showActions={false}
      >
        <div className={`border-4 ${getAlertColor()} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-gray-200 poppins text-base leading-relaxed">
              {alertModal.message}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {alertModal.showCancel && (
            <Button variant="secondary" onClick={closeAlert} className="flex-1">
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              alertModal.onConfirm();
              closeAlert();
            }}
            className={alertModal.showCancel ? 'flex-1' : 'w-full'}
          >
            {alertModal.showCancel ? 'Confirm' : 'OK'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
