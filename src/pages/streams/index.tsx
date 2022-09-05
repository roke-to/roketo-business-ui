import clsx from 'clsx';
import {useStore} from 'effector-react';
import {useCallback, useState} from 'react';

import {CreateStream} from '~/features/create-stream/CreateStream';
import {WithdrawAllButton} from '~/features/stream-control/WithdrawAllButton';
import {STREAM_DIRECTION, StreamDirection} from '~/shared/api/roketo/constants';
import {testIds} from '~/shared/constants';
import {Button} from '~/shared/roketo-ui/components/Button';
import {ProgressBar} from '~/shared/roketo-ui/components/ProgressBar';
import {Modal} from '~/shared/roketo-ui/Modal';
import {Layout} from '~/shared/ui/components/layout';
import {Row} from '~/shared/ui/components/row';

import {$financialStatus, handleCreateStreamFx} from './model';
import {StreamFilters} from './StreamFilters';
import {StreamsList} from './StreamsList';
import styles from './styles.module.scss';

const FinancialInfo = ({
  title,
  total,
  streamed = 0,
  withdrawn = 0,
  withProgressBar = true,
  testId,
  direction = null,
  className,
}: {
  title: string;
  total: number;
  streamed?: number;
  withdrawn?: number;
  withProgressBar?: boolean;
  testId?: string;
  direction?: StreamDirection | null;
  className?: string;
}) => (
  <div className={clsx(styles.infoCard, className)}>
    <h3 className={styles.infoTitle}>{title}</h3>

    <span className={withProgressBar ? styles.finance : styles.financeLarge} data-testid={testId}>
      {streamed ? `$ ${streamed} of ${total}` : `$ ${total}`}
    </span>

    {withProgressBar && (
      <ProgressBar
        total={String(total)}
        streamed={String(streamed)}
        withdrawn={String(withdrawn)}
        direction={direction}
        className={styles.progressBar}
      />
    )}
  </div>
);

const StreamsPageContent = () => {
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const toggleModal = useCallback(
    () => setIsModalOpened(!isModalOpened),
    [setIsModalOpened, isModalOpened],
  );

  const submitting = useStore(handleCreateStreamFx.pending);

  const {outcomeAmountInfo, incomeAmountInfo, availableForWithdrawal} = useStore($financialStatus);

  return (
    <>
      <Row className='mobile:flex-col'>
        <div className={clsx(styles.shadowCard, styles.sendingReceivingStatus)}>
          <FinancialInfo
            title='Sending'
            total={outcomeAmountInfo.total}
            streamed={outcomeAmountInfo.streamed}
            withdrawn={outcomeAmountInfo.withdrawn}
            direction={STREAM_DIRECTION.OUT}
            className={styles.sendingCard}
          />

          <FinancialInfo
            title='Receiving'
            total={incomeAmountInfo.total}
            streamed={incomeAmountInfo.streamed}
            withdrawn={incomeAmountInfo.withdrawn}
            direction={STREAM_DIRECTION.IN}
            className={styles.receivingCard}
          />
          <Button
            className={clsx(styles.button, styles.createStreamButton)}
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
              submitting={submitting}
            />
          </Modal>
        </div>

        <div className={clsx(styles.shadowCard, styles.withdrawalStatus)}>
          <FinancialInfo
            title='Available for withdrawal'
            total={availableForWithdrawal}
            withProgressBar={false}
            testId={testIds.availableForWithdrawalCaption}
          />
          <WithdrawAllButton className={styles.button} />
        </div>
      </Row>
      <StreamFilters className={styles.streamFilters} />

      <StreamsList className={styles.streamListBlock} onCreateStreamClick={toggleModal} />
    </>
  );
};

export const StreamsPage = () => (
  <Layout>
    <StreamsPageContent />
  </Layout>
);