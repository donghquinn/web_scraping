import { Controller, Get } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ClimateProvider } from 'libraries/providers/climate.lib';

@Controller('climate')
export class ClimateController {
  constructor(private readonly climate: ClimateProvider) {}

  @Get('today')
  async getClimate() {
    try {
      const result = await this.climate.getDailyClimateData();

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }
}
