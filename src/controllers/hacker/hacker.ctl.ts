import { Controller, Get } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { HackersNewsProvider } from 'libraries/providers/hacker.lib';

@Controller('hacker')
export class HackerController {
  constructor(private readonly hacker: HackersNewsProvider) {}

  @Get('/count')
  async getHackerCount() {
    try {
      const count = await this.hacker.getHackerNewsCount();

      return new SetResponse(200, { count });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }

  @Get('/news')
  async getHackerNews() {
    try {
      const news = await this.hacker.bringTodayHackerPosts();

      return new SetResponse(200, { news });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }
}
