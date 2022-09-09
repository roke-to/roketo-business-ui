import React from 'react';

import {ButtonNativeLink} from '../button-link';

interface PageStubProps {
  primaryText: string;
  secondaryText: string;
}
export const PageStub = ({primaryText, secondaryText}: PageStubProps) => (
  <div className='px-8 py-6 border border-blue-sat_1 rounded-3xl flex flex-row tablet:flex-col gap-12 tablet:gap-4 tablet:px-6 tablet:py-4 tablet:pb-6'>
    <div className='w-1/2 flex flex-col gap-2 tablet:w-full'>
      <h2 className='text-heading'>{primaryText}</h2>
      <p className=' text-gray'>{secondaryText}</p>
    </div>
    <ButtonNativeLink
      className='ml-auto tablet:ml-0'
      href='https://9drgrlu3ak4.typeform.com/to/H0v7xT7i'
      target='_blank'
    >
      Get early acces
    </ButtonNativeLink>
  </div>
);
