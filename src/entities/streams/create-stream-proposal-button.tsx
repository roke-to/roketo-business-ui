import clsx from 'clsx';
import React from 'react';

import {CreateStream} from '~/entities/create-stream/CreateStream';
import {loadTokenBalances} from '~/entities/treasury/model/treasury';
import {testIds} from '~/shared/constants';
import {Button} from '~/shared/roketo-ui/components/Button';
import {Modal} from '~/shared/roketo-ui/Modal';

import {handleCreateStreamFx} from './model';
import styles from './styles.module.scss';

export const CreateStreamProposalButton = ({
  className,
  submitting,
}: {
  submitting?: boolean;
  className?: string;
}) => {
  const [isModalOpened, setIsModalOpened] = React.useState<boolean>(false);
  const toggleModal = React.useCallback(() => {
    if (!isModalOpened) {
      // load tokens for each open action for modal
      // keep current balance tokens + actual daoId
      loadTokenBalances();
    }
    setIsModalOpened(!isModalOpened);
  }, [setIsModalOpened, isModalOpened]);

  return (
    <>
      <Button
        className={clsx(styles.button, styles.createStreamButton, className)}
        onClick={toggleModal}
        testId={testIds.createStreamButton}
      >
        Create a stream
      </Button>
      <Modal isOpen={isModalOpened} onCloseModal={toggleModal}>
        <CreateStream
          onFormCancel={toggleModal}
          onFormSubmit={(values) =>
            handleCreateStreamFx(values).then(() => setIsModalOpened(false))
          }
          submitting={submitting || false}
        />
      </Modal>
    </>
  );
};
