import { Controller, Get } from "@nestjs/common";
import { SetErrorResponse, SetResponse } from "dto/response.dto";
import { BbcNewsProvider } from "libraries/providers/bbc.lib";
import { HackersNewsProvider } from "libraries/providers/hacker.lib";

@Controller("bbc")
export class BbcController {
  constructor(private readonly bbc: BbcNewsProvider) {}

  @Get()
  async getBbcCount() {
    try {
      const count = await this.bbc.getBbcNewsCount();

      return new SetResponse(200, { count });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }
}
