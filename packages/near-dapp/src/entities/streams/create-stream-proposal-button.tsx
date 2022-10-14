import React from 'react';

import {CreateStream} from '~/entities/create-stream/CreateStream';
import {loadTokenBalances} from '~/entities/treasury/model/treasury';
import {Modal} from '~/shared/roketo-ui/Modal';
import {Button, ButtonSize} from '~/shared/ui/components/button';

import {handleCreateStreamFx} from './model';

export const CreateStreamProposalButton = ({
  className,
  submitting,
  size,
}: {
  submitting?: boolean;
  className?: string;
  size?: ButtonSize;
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
      <Button size={size} className={className} onClick={toggleModal}>
        Propose to create a stream
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
