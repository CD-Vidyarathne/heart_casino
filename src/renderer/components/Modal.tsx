import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showActions = true,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          <div className="mb-6">{children}</div>
          {showActions && (
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={onCancel || onClose}
              >
                {cancelText}
              </Button>
              {onConfirm && (
                <Button
                  variant="primary"
                  onClick={onConfirm}
                >
                  {confirmText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
