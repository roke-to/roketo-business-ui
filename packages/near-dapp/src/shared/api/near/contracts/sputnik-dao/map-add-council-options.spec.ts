import {mapAddCouncilOptions} from './map-add-council-options';

describe('Add council options', () => {
  test('return right options for success request', () => {
    const formData = {
      type: 'addCouncil',
      quorum: 10,
      councilAddress: 'barsik.testnet',
      councilList: ['extg.testnet', 'rkatarine.testnet', 'extg2.testnet'],
      amount: '1',
      token: 'near',
      description: 'add barsik.testnet',
      link: '',
      tgas: '150',
    };
    expect(mapAddCouncilOptions(formData)).toMatchObject({
      methodName: 'add_proposal',
      args: {
        proposal: {
          description: 'add barsik.testnet$$$$$$$$ProposeAddMember',
          kind: {
            AddMemberToRole: {
              member_id: 'barsik.testnet',
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
