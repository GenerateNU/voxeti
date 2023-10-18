import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { userApi } from "../../api/api.ts";

// Question being asked
type FormQuestion = {
  prompt?: string;
  format: string;
  key: string;
  rules?: {};
  type?: string;
  options?: {
    choiceLabel: string;
    choiceValue: any;
    choiceSubtitle?: string;
  }[];
};

// Groups of questions that are displayed in the same line
type QuestionGroup = {
  questions?: FormQuestion[];
};

// Each "page" of the form
type FormSection = {
  sectionTitle: string;
  questionGroups: QuestionGroup[];
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
      questionGroups: [
        {
          questions: [
            {
              key: "userType",
              format: "selection",
              type: "radio",
              options: [
                {
                  choiceLabel: "Producer",
                  choiceValue: "producer",
                },
                { choiceLabel: "Designer", choiceValue: "designer" },
              ],
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Email",
              format: "default",
              key: "email",
              rules: { required: true },
              type: "email",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Password",
              format: "default",
              key: "password",
              rules: { required: true },
              type: "password",
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "Tell us about yourself!",
      questionGroups: [
        {
          questions: [
            {
              prompt: "First Name",
              format: "default",
              key: "firstName",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Last Name",
              format: "default",
              key: "lastName",
              rules: { required: true },
              type: "text",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Bio",
              format: "default",
              key: "bio",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Address Line 1",
              format: "default",
              key: "address.line1",
              rules: { required: true },
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Address Line 2",
              format: "default",
              key: "address.line2",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Country Code",
              format: "default",
              key: "phoneNumber.countryCode",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Phone Number",
              format: "default",
              key: "phoneNumber.number",
              rules: { required: true },
              type: "text",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "City",
              format: "default",
              key: "address.city",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "State",
              format: "default",
              key: "address.state",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Zip",
              format: "default",
              key: "address.zipCode",
              rules: { required: true },
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Name",
              format: "default",
              key: "address.name",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Country",
              format: "default",
              key: "address.country",
              rules: { required: true },
              type: "text",
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "How would you describe your experience level?",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Experience",
              key: "experience",
              format: "selection",
              type: "radio",
              options: [
                {
                  choiceLabel: "Beginner",
                  choiceValue: "beginner",
                  choiceSubtitle:
                    "I have never touched a 3D printer or designed anything.",
                },
                {
                  choiceLabel: "Intermediate",
                  choiceValue: "intermediate",
                  choiceSubtitle:
                    "I have interacted with a 3D printer and have created a design.",
                },
                {
                  choiceLabel: "Expert",
                  choiceValue: "expert",
                  choiceSubtitle:
                    "I'm very comfortable with 3D printers and their designs.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "What kind of 3D printers do you own?",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Printers",
              key: "printer",
              format: "selection",
              type: "checkbox",
              options: [
                {
                  choiceLabel: "Creality",
                  choiceValue: "creality",
                  choiceSubtitle: "with subtitle",
                },
                { choiceLabel: "Prusa", choiceValue: "prusa" },
              ],
            },
          ],
        },
      ],
    },
    // You can add more sections and questions as needed
  ],
};
const QuestionForm = () => {
  const { control, handleSubmit } = useForm();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [createUser] = userApi.useCreateUserMutation();

  const onSubmit = (data: any) => {
    console.log(data);
    data.experience = parseInt(data.experience, 10);
    data.addresses = [data.address];
    createUser(data)
      .unwrap()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data);
  };

  const currentSection: FormSection = questions.sections[currentSectionIndex];
  const renderQuestions = () => {
    return (
      <div className="flex flex-col justify-center min-w-[300px]">
        <h2 className="text-xl text-center">{currentSection?.sectionTitle}</h2>
        {currentSection?.questionGroups.map((group, _) => (
          <div className="flex">
            {group.questions?.map((question, _) => (
              <Controller
                key={question.key + "cont"}
                name={question.key}
                control={control}
                render={({ field }) => {
                  switch (question.format) {
                    case "selection":
                      return (
                        <ul className="flex flex-grow flex-col m-2">
                          {question.options?.map((option, _) => (
                            <li>
                              <input
                                type={question.type}
                                id={option.choiceValue}
                                value={option.choiceValue}
                                className="hidden peer"
                                key={option.choiceValue}
                                name={question.key}
                              ></input>
                              <label
                                htmlFor={option.choiceValue}
                                className="inline-flex items-center justify-between w-full p-5 cursor-pointer outline outline-1 rounded-md peer-checked:bg-primary peer-checked:bg-opacity-10 hover:bg-primary hover:bg-opacity-5"
                              >
                                <div className="block">
                                  <div className="w-full text-lg font-semibold">
                                    {option.choiceLabel}
                                  </div>
                                  <div className="w-full text-sm">
                                    {option.choiceSubtitle}
                                  </div>
                                </div>
                              </label>
                            </li>
                          ))}
                        </ul>
                      );
                    default:
                      return (
                        <div className="flex flex-grow flex-col m-2">
                          <label className=" py-1">{question.prompt}</label>
                          <input
                            {...field}
                            className=" outline outline-1 p-2 rounded-sm"
                            type={question.type}
                            key={question.key}
                          />
                        </div>
                      );
                  }
                }}
                rules={question.rules}
              />
            ))}
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

  // Only show appropriate buttons based on section index
  const renderButtons = () => {
    return (
      <div className="" key="top">
        {currentSectionIndex > 0 && (
          <div className=" float-left py-4" key="previous">
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
          <div className=" float-right py-4" key="continue">
            <button
              className=" bg-primary text-background rounded-lg p-3"
              type="button"
              onClick={handleNext}
            >
              Continue
            </button>
          </div>
        )}
        {currentSectionIndex == questions.sections.length - 1 && (
          <div className=" float-right py-4" key="enter">
            <button
              className=" bg-primary text-background rounded-lg p-3"
              type="submit"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderQuestions()} {renderButtons()}
      </form>
    </div>
  );
};
export default QuestionForm;
