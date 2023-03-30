import { MetroError } from 'errors/metro.error';
import fetch from 'node-fetch';
import { MetroData, SeoulMetroResponse } from 'types/metro.type';

/**
 * https://data.seoul.go.kr/dataList/OA-12914/S/1/datasetView.do
 *
 * https://www.data.go.kr/data/15048032/fileData.do#tab-layer-openapi
 * filedata
 * https://www.data.go.kr/tcs/dss/selectFileDataDetailView.do?publicDataPk=15048032#tab-layer-file
 */

/**
 * 여의나루: 2528
 * 여의도역: 2527
 * 국회의사당역:
 * 이태원: 2631
 */

export const getSeoulMetroInfo = async () => {
  // const stationName = ['여의도역', '여의나루역', '국회의사당역'];
  const returnData: MetroData[] = [];

  try {
    // const url = process.env.KOREAN_CLIMATE!;
    const token = process.env.KOREAN_ENCODED_TOKEN!;
    const baseUrl = 'https://api.odcloud.kr/api/15048032/v1/uddi:';

    const options = {
      method: 'GET',
    };

    const response = await fetch(
      `${baseUrl}c35fd2c2-b616-4823-b56a-d432b5f67cf2?returnType=json&serviceKey=${token}&page=1&perPage=100`,
      options,
    );

    const responseData = (await response.json()) as SeoulMetroResponse;

    console.log('Response Data: %o', { responseData });

    responseData.data.filter((item) => {
      if (item.역번호 === '2528') {
        returnData.push({
          station: item.역명,
          stationNumber: item.역번호,
          date: item.날짜,
          '05~06': item['05~06'],
          '06~07': item['06~07'],
          '07~08': item['07~08'],
          '08~09': item['08~09'],
          '09~10': item['09~10'],
          '10~11': item['10~11'],
          '11~12': item['11~12'],
          '12~13': item['12~13'],
          '13~14': item['13~14'],
          '14~15': item['14~15'],
          '15~16': item['15~16'],
          '16~17': item['16~17'],
          '17~18': item['17~18'],
          '18~19': item['18~19'],
          '19~20': item['19~20'],
          '20~21': item['20~21'],
          '21~22': item['21~22'],
          '22~23': item['22~23'],
          '23~24': item['23~24'],
          '24~': item['24~'],
        });
      }

      if (item.역번호 === '2527') {
        returnData.push({
          station: item.역명,
          stationNumber: item.역번호,
          date: item.날짜,
          '05~06': item['05~06'],
          '06~07': item['06~07'],
          '07~08': item['07~08'],
          '08~09': item['08~09'],
          '09~10': item['09~10'],
          '10~11': item['10~11'],
          '11~12': item['11~12'],
          '12~13': item['12~13'],
          '13~14': item['13~14'],
          '14~15': item['14~15'],
          '15~16': item['15~16'],
          '16~17': item['16~17'],
          '17~18': item['17~18'],
          '18~19': item['18~19'],
          '19~20': item['19~20'],
          '20~21': item['20~21'],
          '21~22': item['21~22'],
          '22~23': item['22~23'],
          '23~24': item['23~24'],
          '24~': item['24~'],
        });
      }
    });

    return responseData;
  } catch (error) {
    throw new MetroError(
      'Seoul Metro',
      'Scrape Seoul Metro Info Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

await getSeoulMetroInfo();
