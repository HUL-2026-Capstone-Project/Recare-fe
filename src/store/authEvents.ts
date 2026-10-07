let forceLogoutHandler: (() => void) | null = null;

export function setForceLogoutHandler(handler: () => void) {
  forceLogoutHandler = handler;
}

export function triggerForceLogout() {
  forceLogoutHandler?.();
}
