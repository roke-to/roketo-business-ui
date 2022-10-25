import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ChangePolicyButton, Councils} from '~/entities/councils';
import {LastGovernanceProposal} from '~/entities/governance';
import {$isMobileScreen} from '~/entities/screens';
import {CreateStreamProposalButton} from '~/entities/streams/create-stream-proposal-button';
import {StreamsList} from '~/entities/streams/StreamsList';
import {
  CreateTreasuryProposalButton,
  LastTreasuryProposal,
  TreasuryInfo,
} from '~/entities/treasury';
import {ROUTES} from '~/shared/config/routes';

import {ButtonLink} from '@roketo/core/ui/components/button-link';
import {Col} from '@roketo/core/ui/components/col';
import {Line} from '@roketo/core/ui/components/line';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

export const Dashboard = () => {
  const isMobile = useStore($isMobileScreen);
  const {t} = useTranslation('dashboard');

  return (
    <Col gap='3xl' className='mb-20'>
      <Col>
        <Row justify='between' align='center'>
          <Typography as='h2' font='heading'>
            {t('treasury')}
          </Typography>
          {!isMobile && (
            <Row>
              <CreateTreasuryProposalButton size='sm' />
              <ButtonLink size='sm' to={ROUTES.treasury.path}>
                {t('manageTreasury')}
              </ButtonLink>
            </Row>
          )}
        </Row>
        <TreasuryInfo variant='dashboard'>
          {isMobile && (
            <>
              <Line />
              <Col>
                <CreateTreasuryProposalButton />
                <ButtonLink to={ROUTES.treasury.path}>{t('manageTreasury')}</ButtonLink>
              </Col>
            </>
          )}
        </TreasuryInfo>
        <LastTreasuryProposal />
      </Col>
      <Col>
        <Row justify='between' align='center'>
          <Typography as='h2' font='heading'>
            {t('daoManagment')}
          </Typography>
          {!isMobile && (
            <Row>
              <ChangePolicyButton size='sm' />
              <ButtonLink size='sm' to={ROUTES.governance.path}>
                {t('manageDao')}
              </ButtonLink>
            </Row>
          )}
        </Row>
        <Councils variant='dashboard'>
          {isMobile && (
            <>
              <Line />
              <Col>
                <ChangePolicyButton />
                <ButtonLink to={ROUTES.governance.path}>{t('manageDao')}</ButtonLink>
              </Col>
            </>
          )}
        </Councils>
        <LastGovernanceProposal />
      </Col>
      <Col>
        <Row justify='between' align='center'>
          <Typography as='h2' font='heading'>
            {t('streams')}
          </Typography>
          {!isMobile && (
            <Row>
              <CreateStreamProposalButton size='sm' />
              <ButtonLink size='sm' to={ROUTES.streams.path}>
                {t('manageStreams')}
              </ButtonLink>
            </Row>
          )}
        </Row>
        <StreamsList />
      </Col>
    </Col>
  );
};
