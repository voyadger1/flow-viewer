import { createEvent, createStore } from 'effector';

export const setHeaderHeight = createEvent<number>();
export const $headerHeight = createStore(0).on(setHeaderHeight, (_, payload) => payload);
