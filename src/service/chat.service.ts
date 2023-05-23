import { Injectable } from '@nestjs/common';
import PrismaService from './prisma.service';
import { ChatMessage } from '@prisma/client';
import { Subject } from 'rxjs';

@Injectable()
export class ChatService {
  private chatMessageSub = new Subject<ChatMessage>();
  chatMessage$ = this.chatMessageSub.asObservable();

  constructor(private prisma: PrismaService) {}

  async getLast50Messages() {
    return await this.prisma.chatMessage.findMany({
      take: 50,
      orderBy: {
        timestamp: 'asc',
      },
    });
  }

  async addMessage(data: Pick<ChatMessage, 'nickname' | 'text' | 'userId'>) {
    const msg = await this.prisma.chatMessage.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
    this.chatMessageSub.next(msg);
    return msg;
  }
}
