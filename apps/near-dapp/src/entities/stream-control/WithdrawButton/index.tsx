import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';

import {$tokens} from '~/entities/wallet';
import {formatAmount} from '~/shared/api/token-formatter';
import {testIds} from '~/shared/constants';

import {Tooltip} from '@roketo/core/kit/Tooltip';
import {Button, ButtonType, DisplayMode} from '@roketo/core/roketo-ui/components/Button';
import {calculateCliffPercent, getAvailableToWithdraw, getStreamProgress} from '@roketo/sdk';
import type {RoketoStream} from '@roketo/sdk/dist/types';

import {withdrawAllFx} from '../WithdrawAllButton/model';
import styles from './styles.module.scss';

type WithdrawButtonProps = {
  stream: RoketoStream;
  small?: boolean;
  className?: string;
} & Omit<React.ComponentProps<'button'>, 'type'>;

export function WithdrawButton({stream, small = false, className, ...rest}: WithdrawButtonProps) {
  const tokens = useStore($tokens);
  const available = getAvailableToWithdraw(stream);
  const streamed = +getStreamProgress({stream, asPercentage: true}).streamed;
  const cliff = calculateCliffPercent(stream);
  const tokenAccountId = stream.token_account_id;
  const token = tokens[tokenAccountId];
  if (!token) return null;
  const {meta} = token;
  const amount = formatAmount(meta.decimals, available.toFixed());

  const handleWithdraw = (e: React.SyntheticEvent) => {
    e.preventDefault();
    withdrawAllFx([stream.id]);
  };

  const hasPassedCliff = !cliff || streamed > cliff;

  const button = (
    <Button
      disabled={Number(amount) === 0}
      type={ButtonType.button}
      displayMode={hasPassedCliff ? DisplayMode.primary : DisplayMode.secondary}
      className={clsx({[styles.notAllowed]: !hasPassedCliff, [styles.small]: small}, className)}
      onClick={hasPassedCliff ? handleWithdraw : undefined}
      testId={testIds.withdrawButton}
      {...rest}
    >
      Withdraw
    </Button>
  );

  return hasPassedCliff ? (
    button
  ) : (
    <Tooltip
      placement='bottom'
      align={{offset: [0, 20]}}
      overlay={<div className={styles.hasntPassedCliff}>Cliff period isn't passed yet.</div>}
    >
      {button}
    </Tooltip>
  );
}
