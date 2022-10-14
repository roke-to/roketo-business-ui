import {mapRemoveCouncilOptions} from './map-remove-council-options';

describe('Remove council options', () => {
  test('return right options for success request', () => {
    const formData = {
      type: 'removeCouncil',
      quorum: 10,
      councilAddress: 'extg2.testnet',
      councilList: ['extg.testnet', 'rkatarine.testnet', 'extg2.testnet'],
      amount: '1',
      token: 'near',
      description: 'remove extg2.testnet',
      link: '',
      tgas: '150',
    };
    expect(mapRemoveCouncilOptions(formData)).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'remove extg2.testnet$$$$$$$$ProposeRemoveMember',
          kind: {
            RemoveMemberFromRole: {
              member_id: 'extg2.testnet',
              role: 'council',
            },
          },
        },
      },
      gas: '300000000000000',
      deposit: '100000000000000000000000',
    });
  });
});
