export const IS_DEV = import.meta.env.DEV;

export const IS_PROD = import.meta.env.PROD;

export const API_HOST = import.meta.env.VITE_API_HOST || window.location.origin;

export const WS_HOST = import.meta.env.VITE_WS_HOST || `ws://${window.location.host}`;
