import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import AuthService from 'src/service/auth.service';
import { ChatService } from 'src/service/chat.service';

interface SocketData {
  userId?: number;
  nickname?: string;
}

type CustomServer = Server<any, any, any, SocketData>;
type CustomSocket = Socket<any, any, any, SocketData>;

@WebSocketGateway({})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  logger = new Logger('Gateway');
  constructor(
    private chatService: ChatService,
    private authService: AuthService,
  ) {}

  afterInit(server: CustomServer) {
    server.use(async (socket, next) => {
      const { token } = socket.handshake.auth;
      if (!token) return next();
      // verify token
      try {
        const user = await this.authService.verifyToken(token);
        socket.data.userId = user.id;
        socket.data.nickname = user.username;
        return next();
      } catch (err: any) {
        return next(new Error("Couldn't authenticate: invalid token"));
      }
    });
    server.use((socket, next) => {
      this.logger.log('Connection from ' + (socket.data.nickname ?? 'visitor'));
      next();
    });
  }

  handleConnection(socket: CustomSocket) {
    this.chatService
      .getLast50Messages()
      .then((msgs) => msgs.map((msg) => socket.emit('chat-message', msg)));
    this.chatService.chatMessage$.subscribe((msg) =>
      socket.emit('chat-message', msg),
    );
  }

  @SubscribeMessage('send-message')
  async sendMessage(socket: CustomSocket, msg: any) {
    if (!socket.data.nickname) {
      throw new WsException('Username not set');
    }
    if (msg.trim().length === 0) {
      throw new WsException('Your message cannot be empty');
    }
    return await this.chatService.addMessage({
      nickname: socket.data.nickname,
      text: msg,
      userId: socket.data.userId,
    });
  }

  @SubscribeMessage('set-nickname')
  async setNickname(socket: CustomSocket, nickname: string) {
    if (nickname.trim().length === 0) {
      throw new WsException('Your nickname cannot be empty');
    }
    socket.data.nickname = nickname;
  }
}
