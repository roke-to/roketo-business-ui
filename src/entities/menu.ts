import {createEvent, createStore, sample} from 'effector';

export interface ISideBarState {
  isOpen: boolean;
}

export const setSideBarState = createEvent<ISideBarState>();

export const $sideBarState = createStore<ISideBarState>({isOpen: false});

sample({
  clock: setSideBarState,
  target: $sideBarState,
});
