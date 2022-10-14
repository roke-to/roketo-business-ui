import React, {useEffect} from 'react';

import {KeyCode} from '~/shared/lib/keyboard/keyBoardMapping';

export type IgnoreItems = HTMLElement | null;

interface IOverlayProps {
  onClose: () => void;
  getItemsToIgnore?: () => IgnoreItems[];
}

const defaultGetItemsToIgnore = () => [];

export const Overlay = ({
  getItemsToIgnore = defaultGetItemsToIgnore,
  onClose,
  children,
}: React.PropsWithChildren<IOverlayProps>) => {
  const outSideClick = (event: MouseEvent | TouchEvent) => {
    const itemsToIgnore: IgnoreItems[] = getItemsToIgnore();

    // element inside dropdown ignores closing
    if (!itemsToIgnore.some((el) => el && event.composedPath().includes(el))) {
      onClose();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KeyCode.ESCAPE || e.key === KeyCode.ENTER) {
      onClose();
    }
  };

  const onVisibilitychange = () => {
    if (document.visibilityState === 'hidden') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', outSideClick);
    document.addEventListener('touchend', outSideClick);
    document.addEventListener('visibilitychange', onVisibilitychange);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', outSideClick);
      document.removeEventListener('touchend', outSideClick);
      document.removeEventListener('visibilitychange', onVisibilitychange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  );
};
