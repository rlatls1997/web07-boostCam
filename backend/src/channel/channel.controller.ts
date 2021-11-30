import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Session,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginGuard } from '../login/login.guard';
import { ExpressSession } from '../types/session';

import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { ChannelFormDto } from './channel.dto';
import { UserChannelService } from '../user-channel/user-channel.service';
import ResponseEntity from '../common/response-entity';

@Controller('/api/channel')
@UseGuards(LoginGuard)
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private userChannelService: UserChannelService,
  ) {
    this.channelService = channelService;
    this.userChannelService = userChannelService;
  }
  @Get(':id') async findOne(
    @Param('id') id: number,
  ): Promise<ResponseEntity<Channel>> {
    try {
      const foundChannel = await this.channelService.findOne(id);
      return ResponseEntity.ok<Channel>(foundChannel);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/auth') async checkAuthority(
    @Param('id') id: number,
    @Session() session: ExpressSession,
  ): Promise<ResponseEntity<boolean>> {
    const foundChannel = await this.channelService.findOne(id);
    return ResponseEntity.ok<boolean>(foundChannel.ownerId === session.user.id);
  }

  @Post() async saveChannel(
    @Body() channel: ChannelFormDto,
    @Session() session: ExpressSession,
  ): Promise<ResponseEntity<Channel>> {
    const savedChannel = await this.channelService.createChannel(
      channel,
      session.user.id,
    );
    await this.userChannelService.addNewChannel(savedChannel, session.user.id);
    return ResponseEntity.ok<Channel>(savedChannel);
  }
  @Patch(':id') async updateChannel(
    @Param('id') id: number,
    @Body() channel: ChannelFormDto,
    @Session() session: ExpressSession,
  ): Promise<ResponseEntity<Channel>> {
    const changedChannel = await this.channelService.updateChannel(
      id,
      channel,
      session.user.id,
    );
    return ResponseEntity.ok<Channel>(changedChannel);
  }

  @Delete(':id') async deleteChannel(
    @Param('id') id: number,
  ): Promise<ResponseEntity<null>> {
    await this.channelService.deleteChannel(id);
    return ResponseEntity.noContent();
  }
}
