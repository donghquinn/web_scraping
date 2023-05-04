import { Controller, Get } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { NaverProvider } from 'libraries/providers/naver.lib';

@Controller('naver')
export class NaverController {
  constructor(private readonly naver: NaverProvider) {}

  @Get('/today')
  async getTodayNewsController() {
    try {
      const result = await this.naver.getNaverNews();

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }
}
