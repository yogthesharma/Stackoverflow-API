import { getApi } from "./base";

export const getQuestionData = async () => {
  try {
    return await getApi(
      "2.2/questions?page=1&order=desc&sort=activity&site=stackoverflow"
    );
  } catch {
    return console.log("Some Error Occured");
  }
};

export const getSingleQuestion = async (id: number) => {
  try {
    return await getApi(
      `2.2/questions/${id}?order=desc&&pagesize=20&sort=activity&site=stackoverflow&filter=withbody`
    );
  } catch {
    return console.log("Some Error Occured");
  }
};

export const getQuestionDataPagewise = async (page: number) => {
  try {
    return await getApi(
      `2.2/questions?page=${page}&pagesize=50&order=desc&sort=activity&site=stackoverflow`
    );
  } catch {
    return console.log("Some Error Occured");
  }
};
