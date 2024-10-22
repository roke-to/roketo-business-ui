import clsx from 'clsx';
import {useStore, useStoreMap} from 'effector-react';
import React from 'react';

import {$accountStreams} from '~/entities/wallet';
import {testIds} from '~/shared/constants';

import {TokenImage} from '@roketo/core/kit/TokenImage';
import {Tooltip} from '@roketo/core/kit/Tooltip';
import {Button, DisplayMode} from '@roketo/core/roketo-ui/components/Button';

import {$tokenData, triggerWithdrawAll} from './model';
import styles from './styles.module.scss';

export function WithdrawAllButton({className}: {className?: string}) {
  const areStreamsLoaded = useStoreMap({
    store: $accountStreams,
    keys: [],
    fn: ({streamsLoaded}) => streamsLoaded,
  });

  const preparedTokenData = useStore($tokenData);

  return (
    <Tooltip
      placement='bottom'
      align={{offset: [0, 20]}}
      overlay={
        <div className={styles.root}>
          <p className={styles.description}>Move all received tokens to your wallet.</p>

          <div className={styles.preparedTokensWrapper} data-testid={testIds.withdrawTooltip}>
            {!areStreamsLoaded && (
              <p className={styles.description} data-testid={testIds.withdrawLoadingCaption}>
                Loading...
              </p>
            )}

            {preparedTokenData.length !== 0 &&
              preparedTokenData.map((data) => (
                <div key={data.tokenAccountId} className={styles.preparedToken}>
                  <TokenImage tokenAccountId={data.tokenAccountId} />

                  <div className={styles.info}>
                    <span className={styles.amount}>{data.amount}</span>
                    <span className={styles.symbol}>{data.symbol}</span>
                  </div>
                </div>
              ))}

            {areStreamsLoaded && preparedTokenData.length === 0 && (
              <p className={styles.description}>You have nothing to withdraw</p>
            )}
          </div>
        </div>
      }
    >
      <Button
        onClick={() => triggerWithdrawAll()}
        testId={testIds.withdrawAllButton}
        displayMode={preparedTokenData.length !== 0 ? DisplayMode.action : DisplayMode.secondary}
        className={clsx(preparedTokenData.length !== 0 ? undefined : styles.notAllowed, className)}
      >
        Propose withdraw
      </Button>
    </Tooltip>
  );
}
