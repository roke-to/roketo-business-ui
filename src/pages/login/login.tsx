import {LoginPortlet} from '~/features/auth';

import styles from './login.module.css';

export function LoginPage() {
  return (
    <div className={styles.login}>
      <LoginPortlet />
    </div>
  );
}
