import {createEvent, createStore, sample} from '../lib/effector';

import {theme} from '../config/theme';

const mobileScreenMatcher = window.matchMedia(`(max-width: ${theme.screens.tablet.max})`);

const mobileScreenMediaChanged = createEvent<boolean>();

export const $isMobileScreen = createStore(mobileScreenMatcher.matches);

mobileScreenMatcher.addEventListener('change', (ev) => {
  mobileScreenMediaChanged(ev.matches);
});

sample({
  clock: mobileScreenMediaChanged,
  target: $isMobileScreen,
});
