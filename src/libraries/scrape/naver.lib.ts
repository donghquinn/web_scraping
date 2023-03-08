import { subMonths } from "date-fns";
import { NaverError } from "errors/naver.error";
import { NaverSearchRequests } from "types/naver.type";
import { naverAgeDicision } from "utils/age.util";

export const naverSearchLink = async () => {
  try {
    const url = "https://openapi.naver.com/v1/datalab/search";

    const token = process.env.NAVER_TOKEN!;
    const client = process.env.NAVER_CLIENT!;

    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDay();

    const startDate = new Date(`${year}-${month}-${day}`);

    const endDate = subMonths(startDate, 1);

    const ageArray = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "",
    ];

    const requestOptions: Array<NaverSearchRequests> = [];

    ageArray.filter((item) => {
      const options = {
        method: "POST",
        body: JSON.stringify({
          startDate: startDate.toString(),
          endDate: endDate.toString(),
          timeUnit: "week",
          keywordGroups: { groupName: "음악차트", keywords: ["음원 차트"] },
          ages: item,
        }),
      };

      const age = naverAgeDicision(item);
      requestOptions.push({ age, options });
    });
  } catch (error) {
    throw new NaverError(
      "Naver Search Rank",
      "Naver Search Rank Error",
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }
};
