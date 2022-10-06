import {format, parseISO} from 'date-fns';
import React from 'react';

import {CreateTreasuryProposalButton} from '~/entities/treasury';
import {DraftInvoiceResponseDto} from '~/shared/api/rb';

export const DraftInvoice: React.FC<{
  clickHandler: () => void;
  draftInvoice: DraftInvoiceResponseDto;
}> = ({clickHandler, draftInvoice}) => {
  const {amount, token, periodStart, periodEnd, employeeName} = draftInvoice;
  const formatDate = (date: string) => format(parseISO(date), 'yyyy-MM-dd');

  return (
    <div className='flex justify-between px-8 pt-6 pb-8 gap-8 border border-blue-sat_1 rounded-3xl'>
      <span>
        Appoint a salary by transfer proposal of {amount} {token} to {employeeName} for the
        remaining billing period (from {formatDate(periodStart)} to {formatDate(periodEnd)})
      </span>
      <CreateTreasuryProposalButton onClick={clickHandler}>Propose</CreateTreasuryProposalButton>
    </div>
  );
};
