export const getGuestId = (): string => {
  const STORAGE_KEY = "auto-cert-guest-id";
  let guestId = localStorage.getItem(STORAGE_KEY);

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, guestId);
  }

  return guestId;
};
