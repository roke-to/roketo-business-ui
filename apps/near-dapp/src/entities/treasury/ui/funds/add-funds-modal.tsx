import copy from 'clipboard-copy';
import {useStore} from 'effector-react';
import {QRCodeSVG} from 'qrcode.react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$currentDaoId} from '~/entities/wallet';

import {Button} from '@roketo/core/ui/components/button';
import {Col} from '@roketo/core/ui/components/col';
import {Modal, ModalProps} from '@roketo/core/ui/components/modal';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

const SIZE_QR_CODE = 256;

export const AddFundsModal = (modalProps: ModalProps) => {
  const {t} = useTranslation('treasury');
  const currentDaoId = useStore($currentDaoId);

  const handleCopyClick = () => {
    copy(currentDaoId);
    modalProps.onCloseModal?.();
  };

  return (
    <Modal {...modalProps} title={t('addFunds.title')} className='min-w-[384px] mobile:min-w-full'>
      <Col gap='lg'>
        <QRCodeSVG
          value={currentDaoId}
          width={SIZE_QR_CODE}
          height={SIZE_QR_CODE}
          className='mx-auto'
        />
        <Col gap={0}>
          <Typography>{t('addFunds.contractAddress')}</Typography>
          <Typography as='span' font='sm'>
            {currentDaoId}
          </Typography>
        </Col>
        <Row className='mobile:basis-auto justify-center'>
          <Button variant='outlined' onClick={modalProps.onCloseModal}>
            {t('addFunds.cancel')}
          </Button>
          <Button variant='soft' onClick={handleCopyClick}>
            {t('addFunds.copy')}
          </Button>
        </Row>
      </Col>
    </Modal>
  );
};
