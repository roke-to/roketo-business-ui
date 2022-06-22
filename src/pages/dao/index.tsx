import React from 'react';

export function DaoPage() {
  return (
    <div className='relative flex min-h-screen flex-col justify-center overflow-hidden bg-white py-6 sm:py-12'>
      <div className='mx-auto max-w-2xl rounded-3xl bg-[#092540] p-20 text-center'>
        <h2 className='text-5xl font-bold leading-tight text-white'>Create DAO</h2>
        <p className='mt-5 text-xl leading-8 text-white'>
          Create new DAO or change account to find existing.
        </p>
        <div className='mt-6 flex items-center justify-center gap-4'>
          <button
            type='button'
            className='flex items-center justify-center gap-2 rounded-full bg-violet-500 px-5 py-3 text-lg font-medium text-white'
          >
            Let's go
          </button>
        </div>
      </div>
    </div>
  );
}
