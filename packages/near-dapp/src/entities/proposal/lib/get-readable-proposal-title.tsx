import React from 'react';
import {TFunction} from 'react-i18next';

import {StreamLink} from '~/entities/stream-link';
import {getStreamId} from '~/entities/stream-link/get-stream-id';
import {Token} from '~/shared/api/astro';
import {ProposalVariant} from '~/shared/api/near/contracts/sputnik-dao/proposal.types';
import {formatYoktoValue} from '~/shared/lib/currency';
import {getQuorumValueFromPolicy} from '~/shared/lib/get-quorum-value';
import {ImprovedProposalType} from '~/shared/types/proposal.types';

import {base64ToJson} from '@roketo/core/lib/base64';

const getAmountAndSymbolTokenForProposeCreateRoketoStream = (
  proposal: ImprovedProposalType,
  tokenBalances: Array<Token>,
  args?: Record<string, any>,
) => {
  const {
    kind: {receiverId},
  } = proposal;

  const recId = receiverId || 'NEAR';
  const steamedToken = tokenBalances.find((tkn) => tkn.id === recId);

  return {
    balance: formatYoktoValue(args?.Create.request.balance, steamedToken?.decimals),
    token: steamedToken?.symbol || recId,
  };
};

const getAmountAndSymbolTokenForProposeAddFundsToRoketoStream = (
  proposal: ImprovedProposalType,
  tokenBalances: Array<Token>,
  args: Record<string, any> | null,
) => {
  const {
    kind: {receiverId},
  } = proposal;

  const recId = receiverId || 'NEAR';
  const steamedToken = tokenBalances.find((tkn) => tkn.id === recId);

  return {
    balance: formatYoktoValue(args?.amount, steamedToken?.decimals),
    token: steamedToken?.symbol || recId,
  };
};

export const getReadableProposalTitle = (
  proposal: ImprovedProposalType,
  t: TFunction<'proposal', undefined>,
  tokenBalances: Array<Token>,
  variant?: `${ProposalVariant}`,
): React.ReactNode => {
  const {proposer, kind} = proposal;
  const {actions = [], memberId, role, amount = '0', receiverId, policy, tokenId} = kind;
  const methods = actions.map((action) => action.methodName).join(', ');
  const tknId = tokenId || 'NEAR';

  const token = tokenBalances.find((tkn) => tkn.id === tknId);

  const ftTransferCallArgsStr = actions.find(
    (action) => (action.methodName as unknown as string) === 'ft_transfer_call',
  )?.args;
  const ftTransferCallArgs = ftTransferCallArgsStr ? base64ToJson(ftTransferCallArgsStr) : null;
  const msgStr = ftTransferCallArgs ? ftTransferCallArgs?.msg : null;
  const msg = msgStr ? JSON.parse(msgStr) : null;

  switch (kind.type) {
    case 'Transfer':
      return t('readableTitle.Transfer', {
        proposer,
        value: `${formatYoktoValue(amount, token?.decimals)} ${token?.symbol || tokenId}`,
        receiver: receiverId,
      });
    case 'FunctionCall':
      switch (variant) {
        case 'ProposeCreateRoketoStream':
          return `${t('readableTitle.ProposeCreateRoketoStream', {
            proposer,
            receiver: msg.Create.request.receiver_id,
            ...getAmountAndSymbolTokenForProposeCreateRoketoStream(proposal, tokenBalances, msg),
          })}${
            msg.Create.request.cliff_period_sec
              ? t('readableTitle.ProposeRoketoStreamCliffPeriod', {
                  cliffPeriodSec: msg.Create.request.cliff_period_sec,
                })
              : ''
          }`;
        case 'ProposePauseRoketoStream':
          return (
            <>
              {t('readableTitle.ProposePauseRoketoStream', {proposer})}
              <StreamLink streamId={getStreamId({actions, methodName: 'pause_stream'})} />
            </>
          );
        case 'ProposeStartRoketoStream':
          return (
            <>
              {t('readableTitle.ProposeStartRoketoStream', {proposer})}
              <StreamLink streamId={getStreamId({actions, methodName: 'start_stream'})} />
            </>
          );
        case 'ProposeStopRoketoStream':
          return (
            <>
              {t('readableTitle.ProposeStopRoketoStream', {proposer})}
              <StreamLink streamId={getStreamId({actions, methodName: 'stop_stream'})} />
            </>
          );
        case 'ProposeAddFundsToRoketoStream':
          return (
            <>
              {t('readableTitle.ProposeAddFundsToRoketoStream', {
                proposer,
                ...getAmountAndSymbolTokenForProposeAddFundsToRoketoStream(
                  proposal,
                  tokenBalances,
                  ftTransferCallArgs,
                ),
              })}
              <StreamLink streamId={msg?.Deposit.stream_id} />
            </>
          );
        case 'ProposeRoketoStreamWithdraw':
          return (
            <>
              {t('readableTitle.ProposeRoketoStreamWithdraw', {
                proposer,
                ...getAmountAndSymbolTokenForProposeAddFundsToRoketoStream(
                  proposal,
                  tokenBalances,
                  ftTransferCallArgs,
                ),
              })}
              <StreamLink streamId={getStreamId({actions, methodName: 'withdraw'})} />
            </>
          );
        default:
          return t('readableTitle.FunctionCall', {
            proposer,
            contract: receiverId,
            methods,
          });
      }
    case 'AddMemberToRole':
      return t('readableTitle.AddMemberToRole', {
        proposer,
        member: memberId,
        role,
      });
    case 'RemoveMemberFromRole':
      return t('readableTitle.RemoveMemberFromRole', {
        proposer,
        member: memberId,
        role,
      });
    case 'ChangePolicy':
      return t('readableTitle.ChangePolicy', {
        proposer,
        quorum: `${getQuorumValueFromPolicy(policy)}%`,
      });
    default:
      return t('readableTitle.Unknown');
  }
};
