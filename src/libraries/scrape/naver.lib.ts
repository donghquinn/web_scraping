import { NaverError } from 'errors/naver.error';
import fetch from 'node-fetch';
import { NaverNewsResponse, NaverNewsResultReturn } from 'types/naver.type';
import utf8 from 'utf8';

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
