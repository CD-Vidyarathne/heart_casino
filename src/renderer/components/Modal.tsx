import React from 'react';
import { Button } from './Button';
import { cn } from '../lib/utils';

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
      <div className="glass rounded-xl border border-purple-400/30 shadow-2xl max-w-sm w-full mx-4">
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-4 luckiest-guy">{title}</h2>
          <div className="mb-4">{children}</div>
          {showActions && (
            <div className="flex gap-2 justify-end">
              <Button
                variant="cancel"
                onClick={onCancel || onClose}
                size="sm"
              >
                {cancelText}
              </Button>
              {onConfirm && (
                <Button
                  variant="confirm"
                  onClick={onConfirm}
                  size="sm"
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
