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
    const socket = io('https://localhost:3000');

    console.log('INSIDE GATEWAY');
    console.log(payload);
    console.log(payload.user._id);
    const followers = payload.user.followers;

    for (const follower of followers) {
      console.log(follower);
      console.log('GET ' + this.currentUser.get(follower));
      if (this.currentUser.get(follower)) {
        console.log('A logged in user found');
        console.log(`socketId: ${this.currentUser.get(follower)}`);
        //socket.emit('msgToClient', payload.post);
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
    console.log('NEW USER ' + id);
    this.currentUser.set(id, client.id);
    console.log('getting' + this.currentUser.get(id));
  }
}