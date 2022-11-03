import clsx from 'clsx';
import {useStore} from 'effector-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {$isMobileScreen} from '@roketo/core/effects/screens';
import {Button} from '@roketo/core/ui/components/button';
import {Divider} from '@roketo/core/ui/components/divider';
import {DropdownMenu} from '@roketo/core/ui/components/dropdown-menu';
import {DropdownContent} from '@roketo/core/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '@roketo/core/ui/components/dropdown-menu/dropdown-item';
import {IconButton} from '@roketo/core/ui/components/icon-button';
import {Modal, useModal} from '@roketo/core/ui/components/modal';
import {RadioGroup, RadioGroupItem} from '@roketo/core/ui/components/radio-group';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';
import {ReactComponent as ArrowDown} from '@roketo/core/ui/icons/arrow-down.svg';
import {ReactComponent as CardViewIcon} from '@roketo/core/ui/icons/employees/cards.svg';
import {ReactComponent as ListViewIcon} from '@roketo/core/ui/icons/employees/list.svg';
import {ReactComponent as SortIcon} from '@roketo/core/ui/icons/sort.svg';

import * as employeesModel from '../model/employees-model';
import type {ViewType} from './employees';
import styles from './employees-filters.module.css';

export const EmployeesFilters: React.FC<{
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}> = ({viewType, setViewType}) => {
  const {t} = useTranslation('employees');

  const isMobile = useStore($isMobileScreen);

  const filtersModal = useModal();
  const sortModal = useModal();

  const selectedStatus = useStore(employeesModel.$statusFilter);
  const selectedType = useStore(employeesModel.$typeFilter);
  const selectedSort = useStore(employeesModel.$sort);

  if (isMobile) {
    return (
      <Row justify='between' align='center'>
        <Button endIcon={<ArrowDown />} className='text-black' onClick={filtersModal.show}>
          {t(`filters.status.values.${selectedStatus}`)}
        </Button>
        <Modal
          title='Employees filters'
          isOpen={filtersModal.isOpen}
          onCloseModal={filtersModal.hide}
          className={styles.modal}
        >
          <RadioGroup
            name='employeeStatus'
            value={selectedStatus}
            onChange={employeesModel.statusFilterChanged}
          >
            {employeesModel.statusFilterOptions.map((status) => (
              <RadioGroupItem
                key={status}
                value={status}
                label={t(`filters.status.values.${status}`)}
              />
            ))}
          </RadioGroup>

          <Divider />

          <RadioGroup
            name='employeeType'
            value={selectedType}
            onChange={employeesModel.typeFilterChanged}
          >
            {employeesModel.typeFilterOptions.map((type) => (
              <RadioGroupItem key={type} value={type} label={t(`filters.type.values.${type}`)} />
            ))}
          </RadioGroup>
        </Modal>

        <IconButton className='text-black' onClick={sortModal.show}>
          <SortIcon />
        </IconButton>
        <Modal
          title='Employees sort'
          isOpen={sortModal.isOpen}
          onCloseModal={sortModal.hide}
          className={styles.modal}
        >
          <RadioGroup
            name='employeeSort'
            value={selectedSort}
            onChange={employeesModel.sortChanged}
          >
            {employeesModel.sortOptions.map((sort) => (
              <RadioGroupItem key={sort} value={sort} label={t(`sort.values.${sort}`)} />
            ))}
          </RadioGroup>
        </Modal>
      </Row>
    );
  }

  const handleStatusChange = (index: number) => {
    const newStatus = employeesModel.statusFilterOptions[index];
    employeesModel.statusFilterChanged(newStatus);
  };

  const handleTypeChange = (index: number) => {
    const newType = employeesModel.typeFilterOptions[index];
    employeesModel.typeFilterChanged(newType);
  };

  const handleSortChange = (index: number) => {
    const newSort = employeesModel.sortOptions[index];
    employeesModel.sortChanged(newSort);
  };

  return (
    <Row justify='between' align='center'>
      <Row align='center'>
        <Row align='center' gap='sm'>
          <Typography as='span' color='muted'>
            {t('filters.status.title')}:
          </Typography>
          <DropdownMenu label={t(`filters.status.values.${selectedStatus}`)} variant='soft'>
            <DropdownContent
              selected={selectedStatus}
              handleChange={handleStatusChange}
              offset='m'
              gap={3}
            >
              {employeesModel.statusFilterOptions.map((status) => (
                <DropdownItem key={status}>{t(`filters.status.values.${status}`)}</DropdownItem>
              ))}
            </DropdownContent>
          </DropdownMenu>
        </Row>

        <Row align='center' gap='sm'>
          <Typography as='span' color='muted'>
            {t('filters.type.title')}:
          </Typography>
          <DropdownMenu label={t(`filters.type.values.${selectedType}`)} variant='soft'>
            <DropdownContent
              selected={selectedType}
              handleChange={handleTypeChange}
              offset='m'
              gap={3}
            >
              {employeesModel.typeFilterOptions.map((type) => (
                <DropdownItem key={type}>{t(`filters.type.values.${type}`)}</DropdownItem>
              ))}
            </DropdownContent>
          </DropdownMenu>
        </Row>
      </Row>

      <Row align='center' gap='sm'>
        <Row align='center' gap='sm'>
          <Typography as='span' color='muted'>
            {t('sort.title')}:
          </Typography>
          <DropdownMenu label={t(`sort.values.${selectedSort}`)} variant='soft'>
            <DropdownContent
              selected={selectedSort}
              handleChange={handleSortChange}
              offset='m'
              gap={3}
            >
              {employeesModel.sortOptions.map((sort) => (
                <DropdownItem key={sort}>{t(`sort.values.${sort}`)}</DropdownItem>
              ))}
            </DropdownContent>
          </DropdownMenu>
        </Row>

        <IconButton variant='clean' size='sm' onClick={() => setViewType('card')}>
          <CardViewIcon
            className={clsx(styles.viewTypeIcon, {
              [styles.active]: viewType === 'card',
            })}
          />
        </IconButton>
        <IconButton variant='clean' size='sm' onClick={() => setViewType('list')}>
          <ListViewIcon
            className={clsx(styles.viewTypeIcon, {
              [styles.active]: viewType === 'list',
            })}
          />
        </IconButton>
      </Row>
    </Row>
  );
};
