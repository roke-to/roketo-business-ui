import isEmpty from 'lodash/isEmpty';

import {Dao, PolicyDto} from '~/shared/api/astro';
import {COUNCIL} from '~/shared/api/near/contracts/contract.constants';
import {isVotePolicyWithThreshold} from '~/shared/types/proposal.types';

const getQuorum = (ratio: string[]): number =>
  Array.isArray(ratio) && ratio.length !== 0
    ? (parseInt(ratio[0], 10) / parseInt(ratio[1], 10)) * 100
    : 0;

export const getQuorumValueFromDao = (dao: Dao) => {
  const {
    policy: {
      roles,
      defaultVotePolicy: {ratio},
    },
  } = dao;

  const councilRole = roles?.find(({name}) => name === COUNCIL);

  if (councilRole && !isEmpty(councilRole.votePolicy)) {
    // We don't change some votePolicy item, only all collection
    const keysVotePolicy = Object.keys(councilRole.votePolicy);
    const key = keysVotePolicy[0];
    // all `ratio` props equal
    return getQuorum(councilRole.votePolicy[key].ratio);
  }
  return getQuorum(ratio);
};

export const getQuorumValueFromPolicy = ({roles}: PolicyDto) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return 0;
  }

  const councilRole = roles?.find(({name}) => name === COUNCIL);

  if (
    councilRole &&
    !isEmpty(councilRole.votePolicy) &&
    isVotePolicyWithThreshold(councilRole.votePolicy)
  ) {
    const {votePolicy} = councilRole;
    // We don't change some votePolicy item, only all collection
    const keysVotePolicy = Object.keys(votePolicy);
    const key = keysVotePolicy[0];
    // all `ratio` props equal
    return getQuorum(votePolicy[key].threshold);
  }

  return 0;
};
