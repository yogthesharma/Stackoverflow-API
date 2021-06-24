import React, { useEffect, useState } from "react";
import {
  getQuestionData,
  getQuestionDataPagewise,
  getSingleQuestion,
} from "../../api/micsReq";

import styles from "./QuestionCard.module.css";
import close from "../../assets/close.svg";
import { Item } from "../../types/response";

interface Props {}

const QuestionCard = (props: Props) => {
  const [questionResponse, setQuestionResponse] = useState<Item[]>([]);
  const [popupForDetails, setPopupForDetails] = useState<boolean>(false);
  const [singleQuestionDetails, setSingleQuestionDetails] = useState<Item[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  //   functions
  const getQuestions = async () => {
    setLoading(true);
    const data = await getQuestionData();
    setLoading(false);

    const arr = data?.data?.items || [];

    setLoading(false);
    return setQuestionResponse([...questionResponse, ...arr]);
  };

  const getQuestionsPagewise = async (page: number) => {
    const data = await getQuestionDataPagewise(page);
    let x: Item[] = data?.data.items || [];
    return setQuestionResponse([...questionResponse, ...x]);
  };

  const getQuestion = async (id: number) => {
    setLoading(true);

    const data = await getSingleQuestion(id);

    const question = data?.data?.items || [];
    return setSingleQuestionDetails(question);
  };

  const getQuestionDetails = (id: number) => {
    getQuestion(id);
    setPopupForDetails(true);
    setLoading(false);
  };

  // infinite scroll fuddu methods
  const isBottom = (el: HTMLElement) => {
    return el.getBoundingClientRect().bottom <= window.innerHeight + 1000;
  };

  const trackScrolling = () => {
    const wrappedElement = document.getElementById("table");

    if (wrappedElement && isBottom(wrappedElement)) {
      // getQuestions();
      getQuestionsPagewise(page + 1);
      setPage((val) => (val += 1));
    }
  };

  const dateConversion = (ticks?: number) => {
    if (ticks) {
      var date = new Date(parseInt(ticks.toString(), 10) * 1000);
      // example representations
      return date.toUTCString();
    }
  };

  const manageHTMLEntities = (str: string): string => {
    var encodedStr = str.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
      return "&#" + i.charCodeAt(0) + ";";
    });

    return encodedStr;
  };

  // component did mount functionality

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    document?.addEventListener("scroll", trackScrolling);
    return function cleanup() {
      document.removeEventListener("scroll", trackScrolling);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionResponse]);

  return (
    <div id="table" className="h-full min-h-screen overflow-y-auto">
      {loading ? (
        <div className="p-10">
          <p className="font-bold">Loading.....</p>
        </div>
      ) : (
        <>
          <ul className=" bg-gray-600 p-6 px-12">
            {questionResponse?.map((question, index) => {
              return (
                <li
                  key={index}
                  className="mt-4  list-none cursor-pointer "
                  onClick={() => getQuestionDetails(question.question_id)}
                >
                  <h3 className="inline-block font-mono text-white text-base font-bold">
                    {index + 1}. {manageHTMLEntities(question.title)}
                  </h3>
                  <div className="flex w-full items-center justify-between text-gray-400 mt-4">
                    <p>{question.owner.display_name}</p>
                    <p>{dateConversion(question?.creation_date)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {popupForDetails && (
            <div className="fixed w-1/2 h-screen top-12 left-0 transform translate-x-1/2 ">
              <img
                className="w-3 ml-2 mb-2 cursor-pointer"
                src={close}
                alt={close}
                onClick={() => setPopupForDetails(false)}
              />
              <QuestionDetailsPopup
                body={singleQuestionDetails[0]?.body || "<p>Loading ....</p>"}
                question={singleQuestionDetails[0]?.title}
                linkToQuestion={singleQuestionDetails[0]?.link}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionCard;

const QuestionDetailsPopup = ({
  question,
  body,
  linkToQuestion,
}: {
  question: string | undefined;
  body: string;
  linkToQuestion: string | undefined;
}) => {
  return (
    <div className="p-5 w-full max-w-2xl h-full max-h-96 bg-black scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 overflow-y-auto ">
      <div className="mb-6">
        <h3 className="text-xl">Q. {question}</h3>
      </div>
      <div
        className={styles.wrapper}
        dangerouslySetInnerHTML={{ __html: body }}
      ></div>

      <div className="mt-6">
        <a className="text-blue-600 italic underline" href={linkToQuestion}>
          {linkToQuestion}
        </a>
      </div>
    </div>
  );
};
