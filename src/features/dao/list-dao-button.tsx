import {getAccountDaos} from '~/entities/near-wallet';

export const ListDaoButton: React.FC<{className?: string}> = ({className}) => (
  <button type='button' className={className} onClick={() => getAccountDaos()}>
    Get account DAOs
  </button>
);
