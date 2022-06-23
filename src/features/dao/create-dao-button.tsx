import {createDao} from '~/entities/near-wallet';

export const CreateDaoButton: React.FC<{className?: string}> = ({className}) => (
  <button type='button' className={className} onClick={() => createDao()}>
    Create DAO
  </button>
);
