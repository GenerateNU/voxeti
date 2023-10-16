import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

// Question being asked
// TODO somehow allow two questions to be on same line
type FormQuestion = {
  prompt: string;
  key: string;
  rules?: {};
  type?: string;
};

// Each "page" of the form
type FormSection = {
  sectionTitle: string;
  questions: FormQuestion[];
};

// Parent form type with sections
type MultiForm = {
  sections: FormSection[];
};

// Current questions for user registrations
const questions: MultiForm = {
  sections: [
    {
      sectionTitle: "Welcome to Voxeti",
      questions: [
        {
          prompt: "Email",
          key: "email",
          rules: { required: true },
          type: "email",
        },
        {
          prompt: "Password",
          key: "password",
          rules: { required: true },
          type: "password",
        },
      ],
    },
    {
      sectionTitle: "Tell us about yourself!",
      questions: [
        {
          prompt: "First Name",
          key: "firstName",
          rules: { required: true },
          type: "text",
        },
        {
          prompt: "Last Name",
          key: "lastName",
          rules: { required: true },
          type: "text",
        },
        {
          prompt: "Bio",
          key: "bio",
        },
        {
          prompt: "Address Line 1",
          key: "address.line1",
          rules: { required: true },
        },
        {
          prompt: "Address Line 2",
          key: "address.line2",
        },
        {
          prompt: "City",
          key: "address.city",
          rules: { required: true },
          type: "text",
        },
        {
          prompt: "State",
          key: "address.state",
          rules: { required: true },
          type: "text",
        },
        {
          prompt: "Zip",
          key: "address.zipCode",
          rules: { required: true },
        },
      ],
    },
    // You can add more sections and questions as needed
  ],
};
const QuestionForm = () => {
  const { control, handleSubmit } = useForm();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const onSubmit = (data: any) => {
    console.log(data);
  };
  const currentSection: FormSection = questions.sections[currentSectionIndex];
  const renderQuestions = () => {
    return (
      <div className=" w-96">
        <h2 className="flex justify-center items-center text-xl">
          {currentSection?.sectionTitle}
        </h2>
        {currentSection?.questions.map((question, _) => (
          <div key={question.key}>
            <Controller
              key={question.key + "cont"}
              name={`${question.key}`}
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className=" py-1">{question.prompt}</label>
                  <input
                    className=" outline outline-1 p-2 rounded-sm"
                    {...field}
                    type={question.type}
                  />
                </div>
              )}
              rules={question.rules}
            />
          </div>
        ))}
      </div>
    );
  };

  // Go to next section
  const handleNext = () => {
    if (currentSectionIndex < questions.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  // Go to previous section
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };
  return (
    // Only show appropriate buttons based on section index
    <div className="flex justify-center items-center py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderQuestions()}
        <div className="">
          {currentSectionIndex > 0 && (
            <div className=" float-left py-4">
              <button
                className=" bg-primary bg-opacity-5 text-primary rounded-lg p-3"
                type="button"
                onClick={handlePrevious}
              >
                Previous
              </button>
            </div>
          )}
          {currentSectionIndex < questions.sections.length - 1 && (
            <div className=" float-right py-4">
              <button
                className=" bg-primary text-background rounded-lg p-3"
                type="button"
                onClick={handleNext}
              >
                Continue
              </button>
            </div>
          )}
        </div>
        ​
        {currentSectionIndex == questions.sections.length - 1 && (
          <div className=" float-right py-4">
            <button
              className=" bg-primary text-background rounded-lg p-3"
              type="submit"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
export default QuestionForm;
