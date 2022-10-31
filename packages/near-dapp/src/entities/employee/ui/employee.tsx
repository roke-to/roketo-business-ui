import clsx from 'clsx';
import {useStore} from 'effector-react';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import * as employeesModel from '~/entities/employees/model/employees-model';
import {DraftInvoice} from '~/entities/employees/ui/draft-invoice';
import {$isMobileScreen} from '~/entities/screens';
import {CreateStreamProposalButton} from '~/entities/streams/create-stream-proposal-button';
import {CreateTreasuryProposalModal} from '~/entities/treasury/ui/create-treasury-proposal-modal';

import {Button} from '@roketo/core/ui/components/button';
import {Col} from '@roketo/core/ui/components/col';
import {Popover, Transition, usePopper} from '@roketo/core/ui/components/datepicker';
import {IconButton} from '@roketo/core/ui/components/icon-button';
import {Label} from '@roketo/core/ui/components/label';
import {Portlet} from '@roketo/core/ui/components/portlet';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';
import {ReactComponent as ThreeDotsIcon} from '@roketo/core/ui/icons/dots.svg';

import * as employeeModel from '../model/employee-model';
import {EmployeeStatusActions} from './employee-status-actions';
import {EmployeeType} from './employee-type';
import styles from './employee.module.css';
import {UpdateEmployeeModal} from './update-employee-modal';

export const Employee: React.FC = () => {
  const isMobile = useStore($isMobileScreen);

  const {t} = useTranslation('employee');
  const {t: t2} = useTranslation('proposal');

  const employee = useStore(employeeModel.$employee);

  const draftInvoices = useStore(employeesModel.$draftInvoices);
  const currentDraftInvoices = draftInvoices.filter(({employeeId}) => employeeId === employee?.id);

  const [refPopoverButton, setRefPopoverButton] = useState();
  const [refPopoverPanel, setRefPopoverPanel] = useState();

  const {styles: popperStyles, attributes: popperAttributes} = usePopper(
    refPopoverButton,
    refPopoverPanel,
  );

  const isUpdateEmployeeModalOpen = useStore(employeeModel.$isUpdateEmployeeModalOpen);
  const isTransferToEmployeeModalOpen = useStore(employeeModel.$isTransferToEmployeeModalOpen);

  const employeeActions = employee && (
    <>
      <CreateStreamProposalButton />
      <Popover className='relative w-full'>
        <Popover.Button
          as='div'
          // @ts-expect-error
          ref={setRefPopoverButton}
        >
          {isMobile ? (
            <Button className='w-full'>Actions</Button>
          ) : (
            <IconButton>
              <ThreeDotsIcon className='fill-blue-textDefault' />
            </IconButton>
          )}
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
              <Button variant='soft' onClick={() => employeeModel.toggleTransferToEmployeeModal()}>
                {t('buttons.transfer')}
              </Button>
              <Button onClick={() => employeeModel.toggleUpdateEmployeeModal()}>
                {t('buttons.edit')}
              </Button>
              <hr className='h-px border-blue-light' />
              <EmployeeStatusActions status={employee.status} />
            </Portlet>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );

  const ViewComponent = isMobile ? Portlet : Col;

  return (
    <>
      <div className={clsx(styles.root)}>
        {employee && (
          <>
            <Col>
              <ViewComponent>
                <Row align='center' gap='sm'>
                  <Typography as='h2' font='heading'>
                    {employee.name}
                  </Typography>
                  <EmployeeType type={employee.type} status={employee.status} />
                </Row>

                <div className='grid gap-6 break-all lg:grid-cols-3'>
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
                    <Typography>
                      {employee.salary} {employee.token}
                    </Typography>
                  </Label>
                  <Label as='div' content={t('labels.payPeriod')}>
                    {/* TODO нужно поле которое укажет  на каком промежутке работает период (per month etc.) */}
                    <Typography>{employee.payPeriod} per month</Typography>
                  </Label>
                  {employee.comment && (
                    <Label as='div' content={t('labels.comment')} className='lg:col-span-3'>
                      <Typography>{employee.comment}</Typography>
                    </Label>
                  )}
                </div>

                {isMobile && <Col>{employeeActions}</Col>}
              </ViewComponent>

              {currentDraftInvoices.length > 0 && (
                <>
                  <Row>
                    <Typography as='h2' font='heading'>
                      Coming soon payments
                    </Typography>
                  </Row>
                  <Col>
                    {currentDraftInvoices.map((draftInvoice) => (
                      <DraftInvoice
                        clickHandler={() => employeesModel.invoiceDraftModalOpened(draftInvoice)}
                        draftInvoice={draftInvoice}
                        key={draftInvoice.id}
                      />
                    ))}
                  </Col>
                </>
              )}
            </Col>

            {!isMobile && <Row>{employeeActions}</Row>}
          </>
        )}
      </div>

      <CreateTreasuryProposalModal
        isOpen={isTransferToEmployeeModalOpen}
        title={t2('createProposal')}
        onCloseModal={employeeModel.toggleTransferToEmployeeModal}
      />
      <UpdateEmployeeModal
        isOpen={isUpdateEmployeeModalOpen}
        title='Update employee'
        onCloseModal={employeeModel.toggleUpdateEmployeeModal}
      />
    </>
  );
};
