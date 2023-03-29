import { Injectable } from '@nestjs/common';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import fetch from 'node-fetch';
import { SeoulMetroResponse } from 'types/metro.type';

/**
 * https://data.seoul.go.kr/dataList/OA-12914/S/1/datasetView.do
 *
 * https://www.data.go.kr/data/15048032/fileData.do#tab-layer-openapi
 * filedata
 * https://www.data.go.kr/tcs/dss/selectFileDataDetailView.do?publicDataPk=15048032#tab-layer-file
 */
@Injectable()
export class SeoulMetroProvider {
  private stationName: string[];

  constructor(private prisma: PrismaLibrary) {
    /**
     * 여의나루: 2528
     * 여의도역: 2527
     * 국회의사당역:
     * 이태원: 2631
     */
    this.stationName = ['여의도역', '여의나루역', '국회의사당역'];
  }

  async getMetroData() {
    // const url = process.env.KOREAN_CLIMATE!;
    const token = process.env.KOREAN_ENCODED_TOKEN!;
    const baseUrl = 'https://api.odcloud.kr/api/15048032/v1/uddi:';

    const options = {
      method: 'GET',
    };

    const response = await fetch(
      `${baseUrl}c35fd2c2-b616-4823-b56a-d432b5f67cf2?returnType=json&serviceKey=${token}`,
      options,
    );

    const responseData = (await response.json()) as SeoulMetroResponse;
  }
}
