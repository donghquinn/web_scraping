import { Controller, Get } from "@nestjs/common";
import { BbcNewsProvider } from "libraries/providers/bbc.lib";
import { HackersNewsProvider } from "libraries/providers/hacker.lib";

@Controller("bbc")
export class BbcController {
  constructor(private readonly bbc: BbcNewsProvider) {}

  @Get()
  async getBbcCount() {
    try {
    } catch (error) {
      return new SetError();
    }
  }
}
