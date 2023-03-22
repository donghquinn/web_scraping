import { NaverError } from 'errors/naver.error';
import fetch from 'node-fetch';
import { NaverNewsResponse, NaverNewsResultReturn } from 'types/naver.type';
import utf8 from 'utf8';

// export const naverSearchLink = async () => {
//   try {
//     const url = 'https://openapi.naver.com/v1/datalab/search';

//     const token = process.env.NAVER_TOKEN!;
//     const client = process.env.NAVER_CLIENT!;

//     const year = new Date().getFullYear();
//     const month = new Date().getMonth();
//     const day = new Date().getDay();

//     const startDate = new Date(`${year}-${month}-${day}`);

//     const endDate = subMonths(startDate, 1);

//     const ageArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', ''];

//     const requestOptions: Array<NaverSearchRequests> = [];

//     ageArray.filter((item) => {
//       const headers = {
//         'X-Naver-Client-Id': client,
//         'X-Naver-Client-Secret': token,
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//       };
//       const options = {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({
//           startDate: startDate.toString(),
//           endDate: endDate.toString(),
//           timeUnit: 'week',
//           keywordGroups: { groupName: '음악차트', keywords: ['음원 차트'] },
//           ages: item,
//         }),
//       };

//       const age = naverAgeDicision(item);
//       requestOptions.push({ age, options });
//     });

//     const responses = requestOptions.map(async (item) => {
//       const result = (await (await fetch(url, item.options)).json()) as NaverDataLabResponse;

//       return { age: item.age, response: result };
//     });

//     return responses;
//   } catch (error) {
//     throw new NaverError(
//       'Naver Search Rank',
//       'Naver Search Rank Error',
//       error instanceof Error ? error : new Error(JSON.stringify(error)),
//     );
//   }
// };

export const naverNews = async () => {
  try {
    // const newsArray: Array<NaverNewsResultReturn> = [];

    const queryName = utf8.encode('IT');

    const url = `https://openapi.naver.com/v1/search/news.json?&query=${queryName}`;

    const headers = {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT!,
      'X-Naver-Client-Secret': process.env.NAVER_TOKEN!,
    };

    const options = {
      method: 'GET',
      headers,
    };

    const response = (await (await fetch(url, options)).json()) as NaverNewsResponse;

    console.log('Naver News: %o', { response });

    return response.items;
  } catch (error) {
    throw new NaverError(
      'Naver News',
      'Naver News Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
