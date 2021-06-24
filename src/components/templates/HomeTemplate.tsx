import React from "react";
import QuestionCard from "../modules/QuestionCard";

interface Props {}

const HomeTemplate = (props: Props) => {
  return (
    <div className="container">
      <QuestionCard />
    </div>
  );
};

export default HomeTemplate;
