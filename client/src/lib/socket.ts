import { io } from 'socket.io-client'

export const serverUrl = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.hostname}:3000`
  : window.location.origin

export const socket = io(serverUrl)
