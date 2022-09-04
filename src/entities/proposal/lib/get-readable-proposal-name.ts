import {TFunction} from 'react-i18next';

import {Token} from '~/shared/api/astro';
import {formatYoktoValue} from '~/shared/lib/currency';
import {getQuorumValueFromPolicy} from '~/shared/lib/get-quorum-value';
import {ImprovedProposalType} from '~/shared/types/proposal.types';

export const getReadableProposalName = (
  proposal: ImprovedProposalType,
  t: TFunction<'proposal', undefined>,
  tokenBalances: Array<Token>,
) => {
  const {proposer, kind} = proposal;
  const {type, memberId, role, amount = '0', receiverId, policy, tokenId} = kind;

  const token = tokenBalances.find((tkn) => tkn.id === tokenId);

  switch (kind.type) {
    case 'Transfer':
      return `${type} ${formatYoktoValue(amount)} ${token?.symbol || tokenId} ${t(
        'from',
      )} ${proposer} ${t('to')} ${receiverId}`;
    case 'AddMemberToRole':
      return `${proposer} ${t('addMemberToRoleText')} ${memberId} ${t('to')} ${role}`;
    case 'RemoveMemberFromRole':
      return `${proposer} ${t('removeMemberFromRoleText')} ${memberId} ${t('to')} ${role}`;
    case 'ChangePolicy':
      return `${proposer} ${t('changeQuorumText')} ${getQuorumValueFromPolicy(policy)}%`;
    default:
      return 'Unknown proposal type';
  }
};
