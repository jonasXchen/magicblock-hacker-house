// In-memory session store (use database in production)
export const sessions = new Map<string, { pubkey: string; expiresAt: number }>();

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}, 60000); // Every minute
