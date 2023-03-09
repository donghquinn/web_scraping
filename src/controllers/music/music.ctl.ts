import { Controller } from "@nestjs/common";
import { SetErrorResponse, SetResponse } from "dto/response.dto";
import { MusicChartProvider } from "libraries/providers/music.lib";

@Controller("music")
export class MusicController {
  constructor(private readonly melon: MusicChartProvider) {}

  async melonChart() {
    try {
      const todayMusicChart = await this.melon.melonMusicChart();

      return new SetResponse(200, { todayMusicChart });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }
}
