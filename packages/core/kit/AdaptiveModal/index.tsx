import clsx from 'clsx';
import type {ReactNode} from 'react';
import Modal from 'react-modal';

import {DropdownMenu} from '../DropdownMenu';
import styles from './styles.module.scss';

export function AdaptiveModal({
  onClose,
  isOpen,
  dropdownClassName,
  overlayClassName,
  modalClassName,
  compact = false,
  children,
}: {
  onClose(): void;
  isOpen: boolean;
  dropdownClassName?: string;
  overlayClassName?: string;
  modalClassName?: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return compact ? (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={clsx(styles.modalContent, modalClassName)}
      overlayClassName={clsx(styles.modalOverlay, overlayClassName)}
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      <>{children}</>
    </Modal>
  ) : (
    <DropdownMenu opened={isOpen} onClose={onClose} className={clsx(dropdownClassName)}>
      {children}
    </DropdownMenu>
  );
}
