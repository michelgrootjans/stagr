import { io } from 'socket.io-client'

const serverPort = import.meta.env.VITE_SERVER_PORT ?? '3000'

export const serverUrl = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.hostname}:${serverPort}`
  : window.location.origin

export const socket = io(serverUrl)
