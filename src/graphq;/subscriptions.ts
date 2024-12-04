import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import WebSocket from 'ws';
import { Application } from 'express';
import { schema } from './schema';

export function startWebSocketServer(app: Application) {
  // Tworzymy serwer WebSocket
  const wsServer = new WebSocket.Server({
    path: '/subscriptions',
    noServer: true,
  });

  // Konfigurujemy WebSocket na połączenia
  wsServer.on('connection', (socket: any) => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
    }, socket);
  });

  // Upgrade HTTP do WebSocket
  const httpServer = app.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql');
  });

  httpServer.on('upgrade', (request: any, socket: any, head: Buffer) => {
    wsServer.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      wsServer.emit('connection', ws, request);
    });
  });
}
