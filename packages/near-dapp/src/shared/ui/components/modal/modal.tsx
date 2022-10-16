import clsx from 'clsx';
import React from 'react';
import ReactModal from 'react-modal';

import {ReactComponent as CloseIcon} from '../../icons/close.svg';
import {Typography} from '../typography';
import styles from './modal.module.css';

export type ModalProps = {
  isOpen: boolean;
  children?: React.ReactNode;
  title?: React.ReactNode;
  onCloseModal?: () => void;
  className?: string;
};

const TRANSITION_DURATION_MS = 200;

const Close = ({className, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={clsx(styles.close, className)} type='button' aria-label='Close'>
    <CloseIcon />
  </button>
);

const renderOverlay = (props: React.ComponentPropsWithRef<'div'>, children: React.ReactElement) => (
  <div {...props}>
    <Close className={styles.overlayClose} />
    {children}
  </div>
);

export const Modal = React.forwardRef<ReactModal, ModalProps>(
  ({title, children, isOpen = true, onCloseModal, className}, ref) => (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onCloseModal}
      overlayElement={renderOverlay}
      className={clsx(styles.content, className)}
      closeTimeoutMS={TRANSITION_DURATION_MS}
      bodyOpenClassName={styles.bodyWithModal}
      overlayClassName={{
        base: styles.overlay,
        afterOpen: styles.overlayAfterOpen,
        beforeClose: styles.overlayBeforeClose,
      }}
      ref={ref}
    >
      <>
        {title && (
          <header className={styles.header}>
            <Typography as='h2' font='heading' className={styles.title}>
              {title}
            </Typography>
          </header>
        )}
        <Close className={styles.contentClose} onClick={onCloseModal} />
        {children}
      </>
    </ReactModal>
  ),
);

Modal.displayName = 'Modal';

export const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const {show, hide} = React.useMemo(
    () => ({
      show: () => setIsOpen(true),
      hide: () => setIsOpen(false),
    }),
    [],
  );

  return {
    show,
    hide,
    isOpen,
  };
};
