import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return await this.userService.getUserProfile(userId);
  }
}
