import * as WebSocket from 'ws';
import { ServerSocket } from '../classes/server_socket.js';

export interface HtmlPage {
  html?: string;
  script?: string;
}

export interface SocketPlayerData {
  player_id: string;
  color: string;
}

export interface ExtendedWebSocket extends WebSocket {
  player_data?: SocketPlayerData;
};

export type FunctionOnAServerSocket = (socket: ExtendedWebSocket) => void ;

export type SocketListener = (object: any, target: ServerSocket) => void;
