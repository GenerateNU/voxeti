import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
const questions = [
  {
    section: "Personal Information",
    questions: [
      "What is your full name?",
      "What is your date of birth?",
      "What is your email address?",
    ],
  },
  {
    section: "Education",
    questions: [
      "What is your highest level of education?",
      "Where did you attend school?",
    ],
  },
  {
    section: "Employment",
    questions: [
      "What is your current job title?",
      "Where do you work?",
      "How long have you been in this job?",
    ],
  },
  {
    section: "Interests",
    questions: [
      "What are your hobbies and interests?",
      "Do you have any other skills or talents?",
    ],
  },
  // You can add more sections and questions as needed
];
const QuestionForm = () => {
  const { control, handleSubmit } = useForm();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const onSubmit = (data: any) => {
    console.log(data);
  };
  const currentSection = questions[currentSectionIndex];
  const renderQuestions = () => {
    return (
      <div>
        <h2>{currentSection?.section}</h2>
        {currentSection?.questions.map((question, index) => (
          <div key={index + question}>
            <Controller
              key={index + question + "cont"}
              name={`${question}`}
              control={control}
              render={({ field }) => (
                <div>
                  <label>{question}</label>
                  <input {...field} />
                </div>
              )}
            />
          </div>
        ))}
      </div>
    );
  };
  const handleNext = () => {
    if (currentSectionIndex < questions.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {renderQuestions()}
      <div className="flex">
        {currentSectionIndex > 0 && (
          <button
            className=" bg-producer"
            type="button"
            onClick={handlePrevious}
          >
            Previous
          </button>
        )}
        {currentSectionIndex < questions.length - 1 && (
          <button className=" bg-designer" type="button" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
      ​
      <button className=" bg-call-to-action" type="submit">
        submit
      </button>
    </form>
  );
};
export default QuestionForm;
