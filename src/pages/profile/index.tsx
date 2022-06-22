import React from 'react';

import {AuthorizeButton} from '~/features/authorization';
import {CreateDaoButton} from '~/features/dao';
import {ProfileName} from '~/features/profile';

export function ProfilePage() {
  return (
    <div className='relative flex min-h-screen flex-col justify-center overflow-hidden bg-white py-6 sm:py-12'>
      <div className='mx-auto max-w-2xl rounded-3xl bg-[#092540] p-20 text-center'>
        <h2 className='text-5xl font-bold leading-tight text-white'>
          <ProfileName />
        </h2>
        <p className='mt-5 text-xl leading-8 text-white'>
          Create new DAO or change account to find existing.
        </p>
        <div className='mt-6 flex items-center justify-center gap-4'>
          <AuthorizeButton className='flex items-center justify-center gap-2 rounded-full bg-violet-500 px-5 py-3 text-lg font-medium text-white' />
          <CreateDaoButton className='flex items-center justify-center gap-2 rounded-full border border-white/50 px-5 py-3 text-lg font-medium text-white' />
        </div>
      </div>
    </div>
  );
}
