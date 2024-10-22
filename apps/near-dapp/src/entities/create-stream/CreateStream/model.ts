import * as Yup from 'yup';

import {$currentDaoId, $near} from '~/entities/wallet';

import {attach} from '@roketo/core/lib/effector';

import {COMMENT_TEXT_LIMIT} from '../constants';

const isReceiverNotEqualOwnerFx = attach({
  source: $currentDaoId,
  effect: (currentDaoId, value: string | undefined) => !!currentDaoId && value !== currentDaoId,
});

const isAddressNotExistsFx = attach({
  source: $near,
  async effect(wallet, value: string | undefined) {
    if (!wallet || !value) return false;
    try {
      const result = await wallet.account.connection.provider.query({
        request_type: 'view_account',
        finality: 'final',
        account_id: value,
      });
      return Boolean(result);
    } catch {
      return false;
    }
  },
});

export const formValidationSchema = Yup.object().shape({
  receiver: Yup.string()
    .required('Receiver is required')
    .test(
      'receiver-not-equal-owner',
      'Receiver can not be the same as the owner',
      isReceiverNotEqualOwnerFx,
    )
    .test('receiver-is-valida-address', 'Address does not exists', isAddressNotExistsFx),
  streamName: Yup.string().max(100, 'Stream name must be less or equal 100 symbols'),
  token: Yup.string().required(),
  deposit: Yup.number()
    .required('Deposit is required')
    .moreThan(0, 'Deposit should be more than 0'),
  duration: Yup.number()
    .required('Stream duration is required')
    .moreThan(0, 'Choose stream duration'),
  autoStart: Yup.boolean(),
  comment: Yup.string().max(COMMENT_TEXT_LIMIT),
  isLocked: Yup.boolean(),
  color: Yup.string(),
  cliffDateTime: Yup.date()
    .nullable()
    .test('futureDate', 'Date cannot be in the past', (value) => !value || value > new Date())
    .test(
      'overCliff',
      'Cliff period cannot be longer than stream duration',
      (value, {parent}) => !value || value.getTime() < Date.now() + parent.duration * 1000,
    ),
});
