let socketInstance = null;

export function getSocket() {
  if (!window.io) return null;

  if (!socketInstance) {
    socketInstance = window.io();
  }

  return socketInstance;
}
