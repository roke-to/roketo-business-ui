import {mapCreateOptions} from './map-create-args';

describe('Create DAO options', () => {
  test('return right options for success request', () => {
    expect(
      mapCreateOptions({
        name: 'test',
        address: 'test',
        councilList: ['test'],
        accountId: 'test',
        callbackUrl: 'test',
      }),
    ).toEqual({
      gas: '1b48eb57e000',
      amount: '6000000000000000000000000',
      callbackUrl: 'test',
      args: {
        name: 'test',
        args: 'eyJwdXJwb3NlIjoiIiwiYm9uZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInZvdGVfcGVyaW9kIjoiNjA0ODAwMDAwMDAwMDAwIiwiZ3JhY2VfcGVyaW9kIjoiODY0MDAwMDAwMDAwMDAiLCJwb2xpY3kiOnsicm9sZXMiOlt7Im5hbWUiOiJjb3VuY2lsIiwic2x1ZyI6ImNvdW5jaWwiLCJraW5kIjp7Ikdyb3VwIjpbInRlc3QiLCJ0ZXN0Il19LCJwZXJtaXNzaW9ucyI6WyIqOkZpbmFsaXplIiwicG9saWN5OkFkZFByb3Bvc2FsIiwiYWRkX2JvdW50eTpBZGRQcm9wb3NhbCIsImJvdW50eV9kb25lOkFkZFByb3Bvc2FsIiwidHJhbnNmZXI6QWRkUHJvcG9zYWwiLCJ2b3RlOkFkZFByb3Bvc2FsIiwicmVtb3ZlX21lbWJlcl9mcm9tX3JvbGU6QWRkUHJvcG9zYWwiLCJhZGRfbWVtYmVyX3RvX3JvbGU6QWRkUHJvcG9zYWwiLCJjb25maWc6QWRkUHJvcG9zYWwiLCJjYWxsOkFkZFByb3Bvc2FsIiwidXBncmFkZV9yZW1vdGU6QWRkUHJvcG9zYWwiLCJ1cGdyYWRlX3NlbGY6QWRkUHJvcG9zYWwiLCJzZXRfdm90ZV90b2tlbjpBZGRQcm9wb3NhbCIsInBvbGljeTpWb3RlQXBwcm92ZSIsInBvbGljeTpWb3RlUmVqZWN0IiwicG9saWN5OlZvdGVSZW1vdmUiLCJhZGRfYm91bnR5OlZvdGVBcHByb3ZlIiwiYWRkX2JvdW50eTpWb3RlUmVqZWN0IiwiYWRkX2JvdW50eTpWb3RlUmVtb3ZlIiwiYm91bnR5X2RvbmU6Vm90ZUFwcHJvdmUiLCJib3VudHlfZG9uZTpWb3RlUmVqZWN0IiwiYm91bnR5X2RvbmU6Vm90ZVJlbW92ZSIsInRyYW5zZmVyOlZvdGVBcHByb3ZlIiwidHJhbnNmZXI6Vm90ZVJlamVjdCIsInRyYW5zZmVyOlZvdGVSZW1vdmUiLCJ2b3RlOlZvdGVBcHByb3ZlIiwidm90ZTpWb3RlUmVqZWN0Iiwidm90ZTpWb3RlUmVtb3ZlIiwicmVtb3ZlX21lbWJlcl9mcm9tX3JvbGU6Vm90ZUFwcHJvdmUiLCJyZW1vdmVfbWVtYmVyX2Zyb21fcm9sZTpWb3RlUmVqZWN0IiwicmVtb3ZlX21lbWJlcl9mcm9tX3JvbGU6Vm90ZVJlbW92ZSIsImFkZF9tZW1iZXJfdG9fcm9sZTpWb3RlQXBwcm92ZSIsImFkZF9tZW1iZXJfdG9fcm9sZTpWb3RlUmVqZWN0IiwiYWRkX21lbWJlcl90b19yb2xlOlZvdGVSZW1vdmUiLCJjYWxsOlZvdGVBcHByb3ZlIiwiY2FsbDpWb3RlUmVqZWN0IiwiY2FsbDpWb3RlUmVtb3ZlIiwiY29uZmlnOlZvdGVBcHByb3ZlIiwiY29uZmlnOlZvdGVSZWplY3QiLCJjb25maWc6Vm90ZVJlbW92ZSIsInNldF92b3RlX3Rva2VuOlZvdGVBcHByb3ZlIiwic2V0X3ZvdGVfdG9rZW46Vm90ZVJlamVjdCIsInNldF92b3RlX3Rva2VuOlZvdGVSZW1vdmUiLCJ1cGdyYWRlX3NlbGY6Vm90ZUFwcHJvdmUiLCJ1cGdyYWRlX3NlbGY6Vm90ZVJlamVjdCIsInVwZ3JhZGVfc2VsZjpWb3RlUmVtb3ZlIiwidXBncmFkZV9yZW1vdGU6Vm90ZUFwcHJvdmUiLCJ1cGdyYWRlX3JlbW90ZTpWb3RlUmVqZWN0IiwidXBncmFkZV9yZW1vdGU6Vm90ZVJlbW92ZSJdLCJ2b3RlX3BvbGljeSI6e319LHsibmFtZSI6ImFsbCIsInNsdWciOiJhbGwiLCJraW5kIjoiRXZlcnlvbmUiLCJwZXJtaXNzaW9ucyI6WyJwb2xpY3k6QWRkUHJvcG9zYWwiLCJhZGRfYm91bnR5OkFkZFByb3Bvc2FsIiwiYm91bnR5X2RvbmU6QWRkUHJvcG9zYWwiLCJ0cmFuc2ZlcjpBZGRQcm9wb3NhbCIsInZvdGU6QWRkUHJvcG9zYWwiLCJyZW1vdmVfbWVtYmVyX2Zyb21fcm9sZTpBZGRQcm9wb3NhbCIsImFkZF9tZW1iZXJfdG9fcm9sZTpBZGRQcm9wb3NhbCIsImNvbmZpZzpBZGRQcm9wb3NhbCIsImNhbGw6QWRkUHJvcG9zYWwiLCJ1cGdyYWRlX3JlbW90ZTpBZGRQcm9wb3NhbCIsInVwZ3JhZGVfc2VsZjpBZGRQcm9wb3NhbCIsInNldF92b3RlX3Rva2VuOkFkZFByb3Bvc2FsIl0sInZvdGVfcG9saWN5Ijp7fX1dLCJkZWZhdWx0X3ZvdGVfcG9saWN5Ijp7IndlaWdodF9raW5kIjoiUm9sZVdlaWdodCIsInF1b3J1bSI6IjAiLCJ0aHJlc2hvbGQiOlsxLDJdfSwicHJvcG9zYWxfYm9uZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInByb3Bvc2FsX3BlcmlvZCI6IjYwNDgwMDAwMDAwMDAwMCIsImJvdW50eV9ib25kIjoiMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiYm91bnR5X2ZvcmdpdmVuZXNzX3BlcmlvZCI6IjYwNDgwMDAwMDAwMDAwMCJ9LCJjb25maWciOnsibmFtZSI6InRlc3QiLCJwdXJwb3NlIjoiIiwibWV0YWRhdGEiOiJleUpzYVc1cmN5STZXMTBzSW1ac1lXZERiM1psY2lJNklpSXNJbVpzWVdkTWIyZHZJam9pSWl3aVpHbHpjR3hoZVU1aGJXVWlPaUowWlhOMElpd2liR1ZuWVd3aU9uc2liR1ZuWVd4VGRHRjBkWE1pT2lJaUxDSnNaV2RoYkV4cGJtc2lPaUlpZlgwPSJ9fQ==',
      },
    });
  });
});
