import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';

@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private userSocketMapping = new Map<string, string>();
  private socketUserMapping = new Map<string, string>();

  constructor(private userService: UserService) {}

  @SubscribeMessage('authenticate')
  async handleAuthenticate(client: Socket, payload: string): Promise<void> {
    const body: {
      email: string;
    } = JSON.parse(payload);
    if (!body.email) {
      client.emit('invalidEmail');
      return;
    }
    console.log('check');
    const user = await this.userService.findOne(body.email);
    if (!user) {
      client.emit('unauthorized');
      return;
    }
    this.userSocketMapping.set(user.id.toString(), client.id);
    this.socketUserMapping.set(client.id, user.id.toString());
    console.log(this.userSocketMapping);
    console.log(this.socketUserMapping);
    client.emit('authenticated');
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: string): Promise<void> {
    console.log(this.socketUserMapping);
    if (!this.socketUserMapping.has(client.id)) {
      client.emit('unauthorized');
      return;
    }
    const body: {
      message: string;
      senderEmail: string;
      receiverEmail: string;
    } = JSON.parse(payload);
    console.log(body);
    if (!body.message || !body.senderEmail || !body.receiverEmail) {
      client.emit('invalidMessage');
      return;
    }
    const senderDb = await this.userService.findOne(body.senderEmail);
    const receiverDb = await this.userService.findOne(body.receiverEmail);
    if (!senderDb || !receiverDb) {
      client.emit('userNotFound');
      return;
    }
    const replyPayload = JSON.stringify({
      ...body,
      senderId: senderDb.id,
      senderName: senderDb.name,
      receiverId: receiverDb.id,
      receiverName: receiverDb.name,
    });

    if (
      await this.userService.createMessage(
        body.message,
        body.senderEmail,
        body.receiverEmail,
      )
    ) {
      this.server
        .to(this.userSocketMapping.get(receiverDb.id.toString()))
        .emit('receiveMessage', replyPayload);
      return;
    }
    client.emit('errorSendingMessage');
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
