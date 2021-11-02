import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { ObjectId } from 'mongoose';
import { Socket, Server } from 'socket.io';
import { io } from 'socket.io-client';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  currentUser;
  constructor() {
    this.currentUser = new Map();
  }
  @WebSocketServer()
  server: Server;
  handleDisconnect(client: Socket) {
    console.log('DISCONNECTED!!');
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log('CONNECTED!!');
  }
  afterInit(server: Server) {
    console.log('INITIALIZED!!');
  }
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, @MessageBody() payload) {
    const followers = payload.user.followers;

    for (const follower of followers) {
      if (this.currentUser.get(follower)) {
        this.server
          .to(this.currentUser.get(follower))
          .emit('msgToClient', payload.post);
        break;
      }
    }
  }
  @SubscribeMessage('newUser')
  handleCurrentUser(
    @MessageBody() id: ObjectId,
    @ConnectedSocket() client: Socket,
  ) {
    this.currentUser.set(id, client.id);
  }
}
