import React from 'react';

import {DropdownMenu} from '@roketo/core/ui/components/dropdown-menu';
import {DropdownContent} from '@roketo/core/ui/components/dropdown-menu/dropdown-content';
import {DropdownItem} from '@roketo/core/ui/components/dropdown-menu/dropdown-item';
import {Row} from '@roketo/core/ui/components/row';
import {Typography} from '@roketo/core/ui/components/typography';

interface Props {
  title: string;
  selected: string;
  dropdownLabel: string;
  options: string[];
  generateDropdownItem: (arg: string) => string;
  handleChange: (arg: number) => void;
}

export const Filter: React.FC<Props> = ({
  title,
  selected,
  options,
  dropdownLabel,
  generateDropdownItem,
  handleChange,
}) => (
  <Row align='center' gap='sm'>
    <Typography as='span' color='muted'>
      {title}:
    </Typography>
    <DropdownMenu
      label={dropdownLabel}
      variant='soft'
      // onClick={canShowModal ? proposalFiltersModal.show : undefined}
      onClick={undefined}
    >
      <DropdownContent
        selected={options.indexOf(selected)}
        handleChange={handleChange}
        offset='m'
        gap={3}
      >
        {options.map((status) => (
          <DropdownItem key={status}>{generateDropdownItem(status)}</DropdownItem>
        ))}
      </DropdownContent>
    </DropdownMenu>
    {/*          <Modal
            isOpen={proposalFiltersModal.isOpen}
            onCloseModal={proposalFiltersModal.hide}
            className={styles.modal}
          >
            <ProposalFilterModal
              setKindProposal={setKindProposal}
              isLoading={isLoading}
              selectedProposalStatus={selectedProposalStatus}
              selectedProposalKind={selectedProposalKind}
              handleChangeProposalStatus={handleChangeProposalStatus}
              handleChangeProposalKind={handleChangeProposalKind}
            />
          </Modal> */}
  </Row>
);
