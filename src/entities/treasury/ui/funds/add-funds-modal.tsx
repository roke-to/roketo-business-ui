import {useStore} from 'effector-react';
import {QRCodeSVG} from 'qrcode.react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$currentDaoId} from '~/entities/wallet';
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {Modal, ModalProps} from '~/shared/ui/components/modal';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

const SIZE_QR_CODE = 256;

export const AddFundsModal = (modalProps: ModalProps) => {
  const {t} = useTranslation('treasury');
  const currentDaoId = useStore($currentDaoId);

  const handleCopyClick = () => {
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
