import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';

import {WithdrawAllButton} from '~/entities/stream-control/WithdrawAllButton';
import {STREAM_DIRECTION, StreamDirection} from '~/shared/api/roketo/constants';
import {testIds} from '~/shared/constants';
import {ProgressBar} from '~/shared/roketo-ui/components/ProgressBar';
import {Row} from 'ui/components/row';

import {CreateStreamProposalButton} from './create-stream-proposal-button';
import {$financialStatus, handleCreateStreamFx} from './model';
import {ProposalsList} from './proposals-list';
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

export const StreamsPageContent = () => {
  const submitting = useStore(handleCreateStreamFx.pending);

  const {outcomeAmountInfo, incomeAmountInfo, availableForWithdrawal} = useStore($financialStatus);

  return (
    <div className='flex flex-col gap-14'>
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
          <CreateStreamProposalButton submitting={submitting} />
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
      <ProposalsList variant='preview' />
      <div className='flex flex-col gap-6'>
        <StreamFilters className={styles.streamFilters} />
        <StreamsList className={styles.streamListBlock} />
      </div>
    </div>
  );
};
