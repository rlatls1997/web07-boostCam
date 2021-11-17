import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerService } from 'src/server/server.service';
import { UserService } from 'src/user/user.service';
import { UserServerRepository } from './user-server.repository';
import { UserServer } from './user-server.entity';

@Injectable()
export class UserServerService {
  constructor(
    private serverService: ServerService,
    private userService: UserService,
    @InjectRepository(UserServerRepository)
    private userServerRepository: UserServerRepository,
  ) {}

  getServerListByUserId(userId: number): Promise<UserServer[]> {
    return this.userServerRepository.getServerListByUserId(userId);
  }

  async create(userId: number, serverId: number): Promise<UserServer> {
    const user = await this.userService.findOne(userId);
    const server = await this.serverService.findOne(serverId);
    const userServer = new UserServer();
    userServer.server = server;
    userServer.user = user;

    return this.userServerRepository.save(userServer);
  }
}
