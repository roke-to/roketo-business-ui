import clsx from 'clsx';
import React from 'react';

import {TokenIcon} from '../../roketo-ui/icons/Tokens';
import styles from './styles.module.scss';

type TokenImageProps = {
  tokenAccountId: string;
  size?: number;
  className?: string;
};

export function TokenImage({tokenAccountId, size = 8, className}: TokenImageProps) {
  return (
    <div
      className={clsx(
        'p-1 flex-shrink-0 rounded-full bg-black inline-flex items-center justify-center',
        `w-${size} h-${size}`,
        className,
      )}
    >
      <TokenIcon
        className={clsx('rounded-full', styles.tokenImage)}
        tokenAccountId={tokenAccountId}
      />
    </div>
  );
}
