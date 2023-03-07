import { Controller, Get } from "@nestjs/common";
import { SetErrorResponse, SetResponse } from "dto/response.dto";
import { HackerError } from "errors/hacker.error";
import { BbcNewsProvider } from "libraries/providers/bbc.lib";
import { HackersNewsProvider } from "libraries/providers/hacker.lib";

@Controller("hacker")
export class HackerController {
  constructor(private readonly hacker: HackersNewsProvider) {}

  @Get("/count")
  async getHackerCount() {
    try {
      const count = await this.hacker.getHackerNewsCount();

      return new SetResponse(200, { count });
    } catch (error) {
      throw new SetErrorResponse(500, error);
    }
  }
}
