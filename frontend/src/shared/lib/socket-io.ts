import { io } from "socket.io-client";

const socketBaseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL;

export const socket = io(socketBaseUrl, {
  path: "/games/socket.io",
  transports: ["websocket"],
});
