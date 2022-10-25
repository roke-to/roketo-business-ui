import {t} from 'i18next';
import React from 'react';

import {ButtonNativeLink} from '../button-link';

interface PageStubProps {
  primaryText: string;
  secondaryText?: string;
  href?: string;
  buttonText?: string;
  className?: string;
}
export const PageStub = ({
  primaryText,
  secondaryText,
  href = 'https://9drgrlu3ak4.typeform.com/to/H0v7xT7i',
  buttonText = t('stub:earlyAccess.buttonText'),
  className,
}: PageStubProps) => (
  <div
    className={`px-8 py-6 border border-blue-sat_1 rounded-3xl flex flex-row tablet:flex-col gap-12 tablet:gap-4 tablet:px-6 tablet:py-4 tablet:pb-6 ${className}`}
  >
    <div className='w-1/2 flex flex-col gap-2 tablet:w-full'>
      <h2 className='text-heading'>{primaryText}</h2>
      {secondaryText && <p className=' text-gray'>{secondaryText}</p>}
    </div>
    <ButtonNativeLink className='ml-auto tablet:ml-0' href={href} target='_blank'>
      {buttonText}
    </ButtonNativeLink>
  </div>
);
