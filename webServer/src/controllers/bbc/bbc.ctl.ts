import { Controller, Get } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { BbcNewsProvider } from 'libraries/providers/bbc.lib';

@Controller('bbc')
export class BbcController {
  constructor(private readonly bbc: BbcNewsProvider) {}

  @Get('/count')
  async getBbcCount() {
    try {
      const count = await this.bbc.getBbcNewsCount();

      return new SetResponse(200, { count });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }

  @Get('/news')
  async getBbcNews() {
    try {
      const news = await this.bbc.bringTodayBbcNews();

      return new SetResponse(200, { news });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }
}
