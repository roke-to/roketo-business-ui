import clsx from 'clsx';
import React, {FC, TextareaHTMLAttributes} from 'react';

import styles from './styles.module.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  className?: string;
}

export const TextArea: FC<TextAreaProps> = ({className, hasError = false, ...rest}) => (
  <textarea className={clsx(styles.textarea, {[styles.error]: hasError}, className)} {...rest} />
);
