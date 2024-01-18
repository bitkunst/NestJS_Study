import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';
import { Model } from 'mongoose';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private logger = new Logger('Chat');

    constructor(
        @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
        @InjectModel(SocketModel.name) private readonly socketModel: Model<SocketModel>,
    ) {
        this.logger.log('constructor');
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        const user = await this.socketModel.findOne({ id: socket.id });
        if (user) {
            socket.broadcast.emit('disconnect_user', user.username);
            await user.deleteOne();
        }

        this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
    }

    afterInit() {
        // constructor 다음으로 실행
        this.logger.log('init');
    }

    @SubscribeMessage('new_user')
    async handleNewUser(
        @MessageBody() username: string,
        @ConnectedSocket() socket: Socket,
    ): Promise<string> {
        // socket.on('new_user', username)
        // socket.emit('hello_user', 'hello ' + username);

        const exist = await this.socketModel.exists({ username });
        if (exist) {
            username = `${username}_${Math.floor(Math.random() * 10000)}`;
        }

        await this.socketModel.create({ id: socket.id, username });

        // 연결된 모든 소켓들한테 데이터 전송
        socket.broadcast.emit('user_connected', username);
        return username;
    }

    @SubscribeMessage('submit_chat')
    async handleSubmitChat(
        @MessageBody() chat: string,
        @ConnectedSocket() socket: Socket,
    ) {
        // 채팅 기록 남기기
        const socketObj = await this.socketModel.findOne({ id: socket.id });
        await this.chattingModel.create({
            user: socketObj,
            chat,
        });
        // 브로드캐스팅
        socket.broadcast.emit('new_chat', { chat, username: socketObj.username });
    }
}
