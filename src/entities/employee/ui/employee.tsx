import {useStore} from 'effector-react';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {usePopper} from 'react-popper';

// TODO fix FSD -->
import {EmployeeStatusActions} from '~/entities/employee/ui/employee-status-actions';
import {CreateStreamProposalButton} from '~/entities/streams/create-stream-proposal-button';
import {CreateTreasuryProposalButton} from '~/entities/treasury/ui/create-treasury-proposal-button';
// TODO fix FSD <--
import {Button} from '~/shared/ui/components/button';
import {Col} from '~/shared/ui/components/col';
import {IconButton} from '~/shared/ui/components/icon-button';
import {Label} from '~/shared/ui/components/label';
import {Portlet} from '~/shared/ui/components/portlet';
import {Row} from '~/shared/ui/components/row';
import {Typography} from '~/shared/ui/components/typography';
import {ReactComponent as ThreeDotsIcon} from '~/shared/ui/icons/dots.svg';

import {Popover, Transition} from '@headlessui/react';

import * as employeeModel from '../model/employee-model';
import {EmployeeType} from './employee-type';

export const Employee: React.FC = () => {
  const {t} = useTranslation('employee');
  const employee = useStore(employeeModel.$employee);

  const [refPopoverButton, setRefPopoverButton] = useState();
  const [refPopoverPanel, setRefPopoverPanel] = useState();

  const {styles: popperStyles, attributes: popperAttributes} = usePopper(
    refPopoverButton,
    refPopoverPanel,
  );

  return (
    employee && (
      <Row>
        <Col className='basis-3/4'>
          <Row align='center' gap='sm'>
            <Typography as='h2' font='heading'>
              {employee.name}
            </Typography>
            <EmployeeType type={employee.type} status={employee.status} />
          </Row>
          <div className='grid gap-6 mb-4 desktop:grid-cols-3'>
            <Label as='div' content={t('labels.position')}>
              <Typography>{employee.position}</Typography>
            </Label>
            <Label as='div' content={t('labels.nearLogin')}>
              <Typography>{employee.nearLogin}</Typography>
            </Label>
            <Label as='div' content={t('labels.email')}>
              <Typography>{employee.email || '—'}</Typography>
            </Label>
            <Label as='div' content={t('labels.salary')}>
              {/* TODO как будто бы нужно отдельное поле для валюты */}
              <Typography>{employee.salary} USD</Typography>
            </Label>
            <Label as='div' content={t('labels.payPeriod')}>
              {/* TODO нужно поле которое укажет  на каком промежутке работает период (per month etc.) */}
              <Typography>{employee.payPeriod} per month</Typography>
            </Label>
            <Label as='div' content={t('labels.payoutType')}>
              {/* TODO у нас нет под это поля в базе */}
              <Typography>Smooth</Typography>
            </Label>
            {employee.comment && (
              <Label as='div' content={t('labels.comment')} className='desktop:col-span-3'>
                <Typography>{employee.comment}</Typography>
              </Label>
            )}
          </div>
          <div>proposal</div>
          <div>actions history</div>
        </Col>
        <Col>
          <Row>
            <CreateStreamProposalButton />
            <Popover className='relative flex'>
              <Popover.Button
                as='div'
                // @ts-expect-error
                ref={setRefPopoverButton}
              >
                <IconButton>
                  <ThreeDotsIcon className='fill-blue-textDefault' />
                </IconButton>
              </Popover.Button>

              <Transition
                enter='transition duration-200 ease-out'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-200 ease-out'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'
              >
                <Popover.Panel
                  // @ts-expect-error
                  ref={setRefPopoverPanel}
                  style={popperStyles.popper}
                  {...popperAttributes.popper}
                >
                  <Portlet className='w-60'>
                    {/* TODO bug при попытке открыть модалку из поппера она сразу же закрывается */}
                    <CreateTreasuryProposalButton>
                      {t('buttons.transfer')}
                    </CreateTreasuryProposalButton>
                    <Button>{t('buttons.edit')}</Button>
                    <hr className='h-px border-blue-light' />
                    <EmployeeStatusActions status={employee.status} />
                  </Portlet>
                </Popover.Panel>
              </Transition>
            </Popover>
          </Row>
        </Col>
      </Row>
    )
  );
};
