import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { userApi } from "../../api/api.ts";

// Question being asked
type FormQuestion = {
  prompt: string;
  key: string;
  rules?: {};
  type?: string;
};

// Groups of questions that are displayed in the same line
type QuestionGroup = {
  questions: FormQuestion[];
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
              prompt: "Email",
              key: "email",
              rules: { required: true },
              type: "email",
            }
          ]
        },
        {
          questions: [
            {
              prompt: "Password",
              key: "password",
              rules: { required: true },
              type: "password",
            },
          ]
        }

      ],
    },
    {
      sectionTitle: "Tell us about yourself!",
      questionGroups: [
        {
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
            }
          ]
        },
        {
          questions: [
            {
              prompt: "Bio",
              key: "bio",
            }
          ]
        },
        {
          questions: [
            {
              prompt: "Address Line 1",
              key: "address.line1",
              rules: { required: true },
            }
          ]
        },
        {
          questions: [
            {
              prompt: "Address Line 2",
              key: "address.line2",
            }
          ]
        },
        {
          questions: [
            {
              prompt: "Country Code",
              key: "phoneNumber.countryCode",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Phone Number",
              key: "phoneNumber.number",
              rules: { required: true },
              type: "text",
            }
          ]
        },
        {
          questions: [
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
            }
          ]
        },
        {
          questions: [
            {
              prompt: "Name",
              key: "address.name",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Country",
              key: "address.country",
              rules: { required: true },
              type: "text",
            }
          ]
        }
      ]
    },
    {
      sectionTitle: "How would you describe your experience level?",
      questionGroups: [
        { 
          questions: [
            {
              prompt: "Experience",
              key: "experience",
              rules: { required: true },
              type: "number",
            }
          ]
        }
      ]
    }
    // You can add more sections and questions as needed
  ]
};
const QuestionForm = () => {
  const { control, handleSubmit } = useForm();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [createUser]  = userApi.useCreateUserMutation();

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
      })
    console.log(data);
  };

  const currentSection: FormSection = questions.sections[currentSectionIndex];
  const renderQuestions = () => {
    return (
      <div className="flex flex-col justify-center min-w-[300px]">
          <h2 className="text-xl text-center">
            {currentSection?.sectionTitle}
          </h2>
          {currentSection?.questionGroups.map((group, _) => (
            <div className="flex">
            {group.questions.map((question, _) => (
              <Controller
                key={question.key + "cont"}
                name={question.key}
                control={control}
                render={({ field }) => (
                  <div className="flex flex-grow flex-col m-2">
                    <label className=" py-1">{question.prompt}</label>
                    <input
                      {...field}
                      className=" outline outline-1 p-2 rounded-sm"
                      type={question.type}
                      key={question.key}
                    />
                  </div>
                )}
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
