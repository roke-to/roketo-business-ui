import {TFunction} from 'react-i18next';

import {formatYoktoValue} from '~/shared/lib/currency';
import {getQuorumValueFromPolicy} from '~/shared/lib/get-quorum-value';
import {ImprovedProposalType} from '~/shared/types/proposal.types';

export const getReadableProposalName = (
  proposal: ImprovedProposalType,
  t: TFunction<'proposal', undefined>,
) => {
  const {proposer, kind} = proposal;
  const {type, memberId, role, amount = '0', receiverId, policy} = kind;

  switch (kind.type) {
    case 'Transfer':
      return `${type} ${formatYoktoValue(amount)} NEAR ${t('from')} ${proposer} ${t(
        'to',
      )} ${receiverId}`;
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
