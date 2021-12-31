/**
 * An alias for window, used to massively reduce RAM usage.
 */
export const win = globalThis['window'];
/**
 * An alias for document, used to massively reduce RAM usage.
 */
export const doc = globalThis['document'];
const GLOBAL_NAMESPACE = "_jojotastic777";
/**
 * A global object intended to inter-process communication.
 */
/* @ts-ignore */
export const data = win[GLOBAL_NAMESPACE];
