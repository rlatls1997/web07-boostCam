import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Session,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LoginGuard } from '../login/login.guard';
import { ExpressSession } from '../types/session';
import { UserServerService } from './user-server.service';
import ResponseEntity from '../common/response-entity';

@Controller('/api/users/servers')
@UseGuards(LoginGuard)
export class UserServerController {
  constructor(private userServerService: UserServerService) {}

  @Post()
  async createUserServer(
    @Session()
    session: ExpressSession,
    @Body() { code },
  ) {
    const user = session.user;
    const newUserServer = await this.userServerService.create(user, code);
    return ResponseEntity.created(newUserServer.id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Session()
    session: ExpressSession,
    @Param('id') id: number,
  ) {
    const userId = session.user.id;
    await this.userServerService.deleteById(id, userId);
    return ResponseEntity.noContent();
  }
}
