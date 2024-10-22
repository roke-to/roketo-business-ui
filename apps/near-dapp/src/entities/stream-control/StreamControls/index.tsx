import clsx from 'clsx';
import {useGate, useStore, useStoreMap} from 'effector-react';
import {ReactNode, useState} from 'react';
import Modal from 'react-modal';

import {blurGate} from '~/entities/blur';
// eslint-disable-next-line boundaries/element-types
import {AddFunds} from '~/entities/steam-add-funds';
import {$accountId, $currentDaoId} from '~/entities/wallet';
import {testIds} from '~/shared/constants';

import {BooleanControl, useBool} from '@roketo/core/hooks/useBool';
import {AdaptiveModal} from '@roketo/core/kit/AdaptiveModal';
import {DropdownMenuDivider, DropdownMenuItem} from '@roketo/core/kit/DropdownMenu';
import {DropdownOpener} from '@roketo/core/kit/DropdownOpener';
import {isActiveStream, isDead, isPausedStream, wasStartedAndLocked} from '@roketo/sdk';
import type {RoketoStream} from '@roketo/sdk/dist/types';

import {StreamStatus} from '../StreamStatus';
import {WithdrawButton} from '../WithdrawButton';
import {$loading, pauseStream, startStream, stopStream} from './model';
import {PauseIcon} from './PauseIcon';
import {StartIcon} from './StartIcon';
import {StopIcon} from './StopIcon';
import styles from './styles.module.scss';

function ConfirmModal({
  modalControl,
  onConfirm,
  header,
  buttonText,
  className,
  children,
  testId,
  modalName,
}: {
  modalControl: BooleanControl;
  onConfirm: () => void;
  header: ReactNode;
  buttonText: ReactNode;
  children: ReactNode;
  className: string;
  testId?: string;
  modalName: string;
}) {
  useGate(blurGate, {
    modalId: modalName,
    active: modalControl.on,
  });
  return (
    <Modal
      isOpen={modalControl.on}
      onRequestClose={modalControl.turnOff}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <h2 className={styles.modalHeader}>{header}</h2>
      <p>{children}</p>
      <div className={styles.modalButtons}>
        <button
          type='button'
          onClick={modalControl.turnOff}
          className={clsx(styles.modalButton, styles.modalSecondary)}
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={() => {
            modalControl.turnOff();
            onConfirm();
          }}
          className={clsx(styles.modalButton, className)}
          data-testid={testId}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
}

export function StreamControls({
  stream,
  className,
  openerClassName,
  dropdownClassName,
  openerText,
  needToUseBlur,
  showStartButton,
  showPauseButton,
  showAddFundsButton,
  showWithdrawButton,
}: {
  stream: RoketoStream;
  className?: string;
  openerClassName?: string;
  dropdownClassName?: string;
  openerText?: ReactNode;
  needToUseBlur?: boolean;
  showStartButton: boolean;
  showPauseButton: boolean;
  showAddFundsButton: boolean;
  showWithdrawButton: boolean;
}) {
  const pauseModalControl = useBool(false);
  const stopModalControl = useBool(false);
  const loading = useStore($loading);
  const [menuOpened, setMenuOpened] = useState(false);
  const {isIncoming, isExternal} = useStoreMap({
    store: $accountId,
    keys: [stream],
    fn(accountId) {
      const outgoing = accountId === stream.owner_id;
      const incoming = accountId === stream.receiver_id;
      const external = !outgoing && !incoming;
      return {isIncoming: incoming, isExternal: external};
    },
  });

  const showStatusOnly = isDead(stream) || isExternal;
  const isStartedAndLocked = wasStartedAndLocked(stream);

  const onClickPause = () => {
    setMenuOpened(false);
    if (isIncoming) {
      pauseModalControl.turnOn();
    } else {
      pauseStream(stream.id);
    }
  };

  const onClickStop = () => {
    setMenuOpened(false);
    stopModalControl.turnOn();
  };

  const opened = menuOpened && !loading;

  useGate(blurGate, {
    modalId: `stream controls ${stream.id}`,
    active: !!needToUseBlur && !showStatusOnly && !isStartedAndLocked && opened,
  });

  const statusClassName = {
    [styles.active]: isActiveStream(stream),
    [styles.pause]: isPausedStream(stream),
    [styles.stop]: isDead(stream),
  };

  if (showStatusOnly) {
    return <StreamStatus className={className} status={stream.status} />;
  }

  if (isStartedAndLocked) {
    return (
      <div className={clsx(styles.relative, className)}>
        <button
          type='button'
          className={clsx(styles.dropdownOpener, openerClassName, styles.notAllowed)}
        >
          <StreamStatus status={stream.status} />
        </button>
      </div>
    );
  }

  return (
    <div className={clsx(styles.relative, className)}>
      <ConfirmModal
        modalControl={pauseModalControl}
        onConfirm={() => pauseStream(stream.id)}
        header='Are you sure?'
        buttonText='Pause'
        className={styles.modalWarning}
        modalName={`pause stream ${stream.id}`}
      >
        As a stream receiver, you will not be able to resume stream. Only stream owners can resume
        streams.
      </ConfirmModal>
      <ConfirmModal
        modalControl={stopModalControl}
        onConfirm={() => stopStream(stream.id)}
        header='Propose to stop the stream'
        buttonText='Stop'
        className={styles.modalDanger}
        testId={testIds.streamModalStopButton}
        modalName={`stop stream ${stream.id}`}
      >
        This action will completely shut down the stream. After that, it can't be turned on.
      </ConfirmModal>
      <DropdownOpener
        opened={opened}
        onChange={setMenuOpened}
        className={clsx(styles.dropdownOpener, openerClassName, statusClassName)}
        testId={testIds.streamControlsDropdown}
      >
        {loading
          ? 'Loading...'
          : openerText || <StreamStatus status={stream.status} className={styles.statusPadded} />}
      </DropdownOpener>
      <AdaptiveModal
        compact={needToUseBlur}
        isOpen={opened}
        onClose={() => setMenuOpened(false)}
        modalClassName={styles.modalContent}
        dropdownClassName={clsx(styles.controlsMenu, dropdownClassName)}
      >
        {showAddFundsButton && (
          <DropdownMenuItem>
            <AddFunds stream={stream} className={styles.controlButton} />
          </DropdownMenuItem>
        )}
        {showWithdrawButton && (
          <DropdownMenuItem>
            <WithdrawButton stream={stream} className={styles.controlButton} />
          </DropdownMenuItem>
        )}
        {showStartButton && (
          <DropdownMenuItem>
            <button
              type='button'
              onClick={() => startStream(stream.id)}
              className={clsx(styles.controlButton, styles.start)}
              data-testid={testIds.streamStartButton}
            >
              <StartIcon />
              <span>Start</span>{' '}
            </button>
          </DropdownMenuItem>
        )}

        {showPauseButton && (
          <DropdownMenuItem>
            <button
              type='button'
              onClick={onClickPause}
              className={clsx(styles.controlButton, styles.pause)}
              data-testid={testIds.streamPauseButton}
            >
              <PauseIcon />
              <span>Pause</span>
            </button>
          </DropdownMenuItem>
        )}

        <DropdownMenuDivider className={styles.menuDivider} />

        <DropdownMenuItem>
          <button
            type='button'
            onClick={onClickStop}
            className={clsx(styles.controlButton, styles.stop)}
            data-testid={testIds.streamStopButton}
          >
            <StopIcon />
            <span>Stop</span>
          </button>
        </DropdownMenuItem>
      </AdaptiveModal>
    </div>
  );
}

export function StreamListControls({
  stream,
  className,
  dropdownClassName,
  needToUseBlur,
  showAddFundsButton,
  showWithdrawButton,
  showStartButton,
  showPauseButton,
  openerContent,
  openerClassName,
}: {
  stream: RoketoStream;
  className?: string;
  dropdownClassName?: string;
  needToUseBlur?: boolean;
  showAddFundsButton: boolean;
  showWithdrawButton: boolean;
  showStartButton: boolean;
  showPauseButton: boolean;
  openerContent: ReactNode;
  openerClassName: string;
}) {
  const pauseModalControl = useBool(false);
  const stopModalControl = useBool(false);
  const loading = useStore($loading);
  const [menuOpened, setMenuOpened] = useState(false);
  const {isIncoming, isExternal} = useStoreMap({
    store: $currentDaoId,
    keys: [stream],
    fn(currentDaoId) {
      const outgoing = currentDaoId === stream.owner_id;
      const incoming = currentDaoId === stream.receiver_id;
      const external = !outgoing && !incoming;
      return {isIncoming: incoming, isExternal: external};
    },
  });

  const showStatusOnly = isDead(stream) || isExternal;
  const isStartedAndLocked = wasStartedAndLocked(stream);

  const onClickPause = () => {
    setMenuOpened(false);
    if (isIncoming) {
      pauseModalControl.turnOn();
    } else {
      pauseStream(stream.id);
    }
  };

  const onClickStop = () => {
    setMenuOpened(false);
    stopModalControl.turnOn();
  };

  const opened = menuOpened && !loading;

  useGate(blurGate, {
    modalId: `stream controls ${stream.id}`,
    active: !!needToUseBlur && !showStatusOnly && !isStartedAndLocked && opened,
  });

  if (showStatusOnly) {
    return <StreamStatus className={className} status={stream.status} />;
  }

  if (isStartedAndLocked) {
    return (
      <div className={clsx(styles.relative, className)}>
        <button type='button' className={clsx(styles.dropdownOpener, styles.notAllowed)}>
          <StreamStatus status={stream.status} />
        </button>
      </div>
    );
  }

  return (
    <div className={clsx(styles.relative, className)}>
      <ConfirmModal
        modalControl={pauseModalControl}
        onConfirm={() => pauseStream(stream.id)}
        header='Are you sure?'
        buttonText='Pause'
        className={styles.modalWarning}
        modalName={`pause stream ${stream.id}`}
      >
        As a stream receiver, you will not be able to resume stream. Only stream owners can resume
        streams.
      </ConfirmModal>
      <ConfirmModal
        modalControl={stopModalControl}
        onConfirm={() => stopStream(stream.id)}
        header='Propose to stop the stream'
        buttonText='Stop'
        className={styles.modalDanger}
        testId={testIds.streamModalStopButton}
        modalName={`stop stream ${stream.id}`}
      >
        This action will completely shut down the stream. After that, it can't be turned on.
      </ConfirmModal>
      <button
        className={clsx(openerClassName)}
        type='button'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMenuOpened(!opened);
        }}
        data-testid={testIds.streamControlsDropdown}
      >
        {openerContent}
      </button>
      <AdaptiveModal
        compact={needToUseBlur}
        isOpen={opened}
        onClose={() => setMenuOpened(false)}
        modalClassName={styles.modalContent}
        dropdownClassName={clsx(styles.streamListControlsMenu, dropdownClassName)}
      >
        {showAddFundsButton && (
          <DropdownMenuItem>
            <AddFunds stream={stream} className={styles.controlButton} />
          </DropdownMenuItem>
        )}
        {showWithdrawButton && (
          <DropdownMenuItem>
            <WithdrawButton stream={stream} className={styles.controlButton} />
          </DropdownMenuItem>
        )}
        {showStartButton && (
          <DropdownMenuItem>
            <button
              type='button'
              onClick={() => startStream(stream.id)}
              className={clsx(styles.controlButton, styles.start)}
              data-testid={testIds.streamStartButton}
            >
              <StartIcon />
              <span>Start</span>{' '}
            </button>
          </DropdownMenuItem>
        )}

        {showPauseButton && (
          <DropdownMenuItem>
            <button
              type='button'
              onClick={onClickPause}
              className={clsx(styles.controlButton, styles.pause)}
              data-testid={testIds.streamPauseButton}
            >
              <PauseIcon />
              <span>Pause</span>
            </button>
          </DropdownMenuItem>
        )}

        <DropdownMenuDivider className={styles.menuDivider} />

        <DropdownMenuItem>
          <button
            type='button'
            onClick={onClickStop}
            className={clsx(styles.controlButton, styles.stop)}
            data-testid={testIds.streamStopButton}
          >
            <StopIcon />
            <span>Stop</span>
          </button>
        </DropdownMenuItem>
      </AdaptiveModal>
    </div>
  );
}
