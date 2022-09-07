import React from 'react';
import {useTranslation} from 'react-i18next';

import {ChangePolicyButton, Councils} from '~/entities/councils';
import {LastGovernanceProposal} from '~/entities/governance';
import {StreamsList} from '~/entities/streams/StreamsList';
import {
  CreateTreasuryProposalButton,
  LastTreasuryProposal,
  TreasuryInfo,
} from '~/entities/treasury';
import {ROUTES} from '~/shared/config/routes';
import {Button} from '~/shared/ui/components/button';
import {ButtonLink} from '~/shared/ui/components/button-link';
import {Col} from '~/shared/ui/components/col';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';

export const Dashboard = () => {
  const {t} = useTranslation('dashboard');

  return (
    <Col gap='3xl' className='mb-20'>
      <Col>
        <Row justify='between' align='center'>
          <Typography as='h2' font='heading'>
            {t('treasury')}
          </Typography>
          <Row>
            <CreateTreasuryProposalButton />
            <ButtonLink to={ROUTES.treasury.path}>{t('manageTreasury')}</ButtonLink>
          </Row>
        </Row>
        <TreasuryInfo variant='dashboard' />
        <LastTreasuryProposal />
      </Col>
      <Col>
        <Row justify='between' align='center'>
          <Typography as='h2' font='heading'>
            {t('daoManagment')}
          </Typography>
          <Row>
            <ChangePolicyButton />
            <ButtonLink to={ROUTES.treasury.path}>{t('manageDao')}</ButtonLink>
          </Row>
        </Row>
        <Councils variant='dashboard' />
        <LastGovernanceProposal />
      </Col>
      <Col>
        <Row justify='between' align='center'>
          <Typography as='h2' font='heading'>
            {t('streams')}
          </Typography>
          <Row>
            <Button>{t('proposeStream')}</Button>
            <ButtonLink to={ROUTES.treasury.path}>{t('manageStreams')}</ButtonLink>
          </Row>
        </Row>
        <StreamsList />
      </Col>
    </Col>
  );
};
