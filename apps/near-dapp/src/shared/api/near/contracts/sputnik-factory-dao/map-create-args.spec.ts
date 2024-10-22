import {mapCreateOptions} from './map-create-args';

describe('Create DAO options', () => {
  test('return right options for success request', () => {
    expect(
      mapCreateOptions({
        name: 'Test',
        address: 'test',
        councilList: ['test'],
        callbackUrl: 'test',
      }),
    ).toMatchObject({
      gas: {
        length: 2,
        negative: 0,
        red: null,
        words: [24035328, 4470348],
      },
      amount: '6000000000000000000000000',
      callbackUrl: 'test',
      args: {
        name: 'test',
        args: 'eyJwdXJwb3NlIjoiIiwiYm9uZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInZvdGVfcGVyaW9kIjoiNjA0ODAwMDAwMDAwMDAwIiwiZ3JhY2VfcGVyaW9kIjoiODY0MDAwMDAwMDAwMDAiLCJwb2xpY3kiOnsicm9sZXMiOlt7Im5hbWUiOiJjb3VuY2lsIiwic2x1ZyI6ImNvdW5jaWwiLCJraW5kIjp7Ikdyb3VwIjpbInRlc3QiXX0sInBlcm1pc3Npb25zIjpbIio6RmluYWxpemUiLCJwb2xpY3k6QWRkUHJvcG9zYWwiLCJhZGRfYm91bnR5OkFkZFByb3Bvc2FsIiwiYm91bnR5X2RvbmU6QWRkUHJvcG9zYWwiLCJ0cmFuc2ZlcjpBZGRQcm9wb3NhbCIsInZvdGU6QWRkUHJvcG9zYWwiLCJyZW1vdmVfbWVtYmVyX2Zyb21fcm9sZTpBZGRQcm9wb3NhbCIsImFkZF9tZW1iZXJfdG9fcm9sZTpBZGRQcm9wb3NhbCIsImNvbmZpZzpBZGRQcm9wb3NhbCIsImNhbGw6QWRkUHJvcG9zYWwiLCJ1cGdyYWRlX3JlbW90ZTpBZGRQcm9wb3NhbCIsInVwZ3JhZGVfc2VsZjpBZGRQcm9wb3NhbCIsInNldF92b3RlX3Rva2VuOkFkZFByb3Bvc2FsIiwicG9saWN5OlZvdGVBcHByb3ZlIiwicG9saWN5OlZvdGVSZWplY3QiLCJwb2xpY3k6Vm90ZVJlbW92ZSIsImFkZF9ib3VudHk6Vm90ZUFwcHJvdmUiLCJhZGRfYm91bnR5OlZvdGVSZWplY3QiLCJhZGRfYm91bnR5OlZvdGVSZW1vdmUiLCJib3VudHlfZG9uZTpWb3RlQXBwcm92ZSIsImJvdW50eV9kb25lOlZvdGVSZWplY3QiLCJib3VudHlfZG9uZTpWb3RlUmVtb3ZlIiwidHJhbnNmZXI6Vm90ZUFwcHJvdmUiLCJ0cmFuc2ZlcjpWb3RlUmVqZWN0IiwidHJhbnNmZXI6Vm90ZVJlbW92ZSIsInZvdGU6Vm90ZUFwcHJvdmUiLCJ2b3RlOlZvdGVSZWplY3QiLCJ2b3RlOlZvdGVSZW1vdmUiLCJyZW1vdmVfbWVtYmVyX2Zyb21fcm9sZTpWb3RlQXBwcm92ZSIsInJlbW92ZV9tZW1iZXJfZnJvbV9yb2xlOlZvdGVSZWplY3QiLCJyZW1vdmVfbWVtYmVyX2Zyb21fcm9sZTpWb3RlUmVtb3ZlIiwiYWRkX21lbWJlcl90b19yb2xlOlZvdGVBcHByb3ZlIiwiYWRkX21lbWJlcl90b19yb2xlOlZvdGVSZWplY3QiLCJhZGRfbWVtYmVyX3RvX3JvbGU6Vm90ZVJlbW92ZSIsImNhbGw6Vm90ZUFwcHJvdmUiLCJjYWxsOlZvdGVSZWplY3QiLCJjYWxsOlZvdGVSZW1vdmUiLCJjb25maWc6Vm90ZUFwcHJvdmUiLCJjb25maWc6Vm90ZVJlamVjdCIsImNvbmZpZzpWb3RlUmVtb3ZlIiwic2V0X3ZvdGVfdG9rZW46Vm90ZUFwcHJvdmUiLCJzZXRfdm90ZV90b2tlbjpWb3RlUmVqZWN0Iiwic2V0X3ZvdGVfdG9rZW46Vm90ZVJlbW92ZSIsInVwZ3JhZGVfc2VsZjpWb3RlQXBwcm92ZSIsInVwZ3JhZGVfc2VsZjpWb3RlUmVqZWN0IiwidXBncmFkZV9zZWxmOlZvdGVSZW1vdmUiLCJ1cGdyYWRlX3JlbW90ZTpWb3RlQXBwcm92ZSIsInVwZ3JhZGVfcmVtb3RlOlZvdGVSZWplY3QiLCJ1cGdyYWRlX3JlbW90ZTpWb3RlUmVtb3ZlIl0sInZvdGVfcG9saWN5Ijp7fX0seyJuYW1lIjoiYWxsIiwic2x1ZyI6ImFsbCIsImtpbmQiOiJFdmVyeW9uZSIsInBlcm1pc3Npb25zIjpbInBvbGljeTpBZGRQcm9wb3NhbCIsImFkZF9ib3VudHk6QWRkUHJvcG9zYWwiLCJib3VudHlfZG9uZTpBZGRQcm9wb3NhbCIsInRyYW5zZmVyOkFkZFByb3Bvc2FsIiwidm90ZTpBZGRQcm9wb3NhbCIsInJlbW92ZV9tZW1iZXJfZnJvbV9yb2xlOkFkZFByb3Bvc2FsIiwiYWRkX21lbWJlcl90b19yb2xlOkFkZFByb3Bvc2FsIiwiY29uZmlnOkFkZFByb3Bvc2FsIiwiY2FsbDpBZGRQcm9wb3NhbCIsInVwZ3JhZGVfcmVtb3RlOkFkZFByb3Bvc2FsIiwidXBncmFkZV9zZWxmOkFkZFByb3Bvc2FsIiwic2V0X3ZvdGVfdG9rZW46QWRkUHJvcG9zYWwiXSwidm90ZV9wb2xpY3kiOnt9fV0sImRlZmF1bHRfdm90ZV9wb2xpY3kiOnsid2VpZ2h0X2tpbmQiOiJSb2xlV2VpZ2h0IiwicXVvcnVtIjoiMCIsInRocmVzaG9sZCI6WzEsMl19LCJwcm9wb3NhbF9ib25kIjoiMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwicHJvcG9zYWxfcGVyaW9kIjoiNjA0ODAwMDAwMDAwMDAwIiwiYm91bnR5X2JvbmQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJib3VudHlfZm9yZ2l2ZW5lc3NfcGVyaW9kIjoiNjA0ODAwMDAwMDAwMDAwIn0sImNvbmZpZyI6eyJuYW1lIjoidGVzdCIsInB1cnBvc2UiOiIiLCJtZXRhZGF0YSI6ImV5SnNhVzVyY3lJNlcxMHNJbVpzWVdkRGIzWmxjaUk2SWlJc0ltWnNZV2RNYjJkdklqb2lJaXdpWkdsemNHeGhlVTVoYldVaU9pSlVaWE4wSWl3aWJHVm5ZV3dpT25zaWJHVm5ZV3hUZEdGMGRYTWlPaUlpTENKc1pXZGhiRXhwYm1zaU9pSWlmWDA9In19',
      },
    });
  });
});
