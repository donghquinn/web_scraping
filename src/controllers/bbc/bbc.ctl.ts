import { Controller } from "@nestjs/common";
import { BbcNewsProvider } from "libraries/providers/bbc.lib";
import { HackersNewsProvider } from "libraries/providers/hacker.lib";

@Controller("bbc")
export class ScrapeController {
  constructor(private readonly bbc: BbcNewsProvider) {}
}
