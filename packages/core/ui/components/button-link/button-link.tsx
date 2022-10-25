import React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {Merge} from 'type-fest';

import {Button, ButtonProps} from '../button';

interface ButtonLinkProps extends Merge<ButtonProps, LinkProps> {
  to: string;
}

// @ts-expect-error Button doesn't accept `to` prop
export const ButtonLink: React.FC<ButtonLinkProps> = (props) => <Button as={Link} {...props} />;

interface ButtonNativeLinkProps
  extends Merge<ButtonProps, React.AnchorHTMLAttributes<HTMLAnchorElement>> {
  href: string;
}

export const ButtonNativeLink: React.FC<ButtonNativeLinkProps> = (props) => (
  // @ts-expect-error Button doesn't accept `href` prop
  <Button as='a' {...props} />
);
