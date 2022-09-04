import {TFunction} from 'react-i18next';

import {Token} from '~/shared/api/astro';
import {formatYoktoValue} from '~/shared/lib/currency';
import {getQuorumValueFromPolicy} from '~/shared/lib/get-quorum-value';
import {ImprovedProposalType} from '~/shared/types/proposal.types';

export const getReadableProposalTitle = (
  proposal: ImprovedProposalType,
  t: TFunction<'proposal', undefined>,
  tokenBalances: Array<Token>,
) => {
  const {proposer, kind} = proposal;
  const {actions = [], memberId, role, amount = '0', receiverId, policy, tokenId} = kind;
  const methods = actions.map((action) => action.methodName).join(', ');

  const token = tokenBalances.find((tkn) => tkn.id === tokenId);

  switch (kind.type) {
    case 'Transfer':
      return t('readableTitle.Transfer', {
        proposer,
        value: `${formatYoktoValue(amount)} ${token?.symbol || tokenId}`,
        receiver: receiverId,
      });
    case 'FunctionCall':
      return t('readableTitle.FunctionCall', {
        proposer,
        contract: receiverId,
        methods,
      });
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
