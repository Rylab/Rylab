export const register = () =>
  Promise.resolve({
    hanko: {
      getCurrentUser: () => Promise.resolve({}),
      logout: () => Promise.resolve(),
      onSessionCreated: () => {},
      onSessionExpired: () => {},
      onUserLoggedOut: () => {},
      validateSession: () => Promise.resolve({ is_valid: false }),
    },
  })
