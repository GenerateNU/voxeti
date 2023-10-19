import { useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { authApi, userApi } from "../../api/api.ts";
import { User } from "../../main.types.ts";
import { ExperienceLevel } from "../../main.types.ts";
import router from "../../router.tsx";
import { useStateDispatch } from "../../hooks/use-redux.ts";
import { setUser } from "../../store/userSlice.ts";
import Auth from "../../components/Auth/Auth.tsx";

// Question being asked
type FormQuestion = {
  prompt?: string;
  format: string;
  key: string;
  rules?: object;
  type?: string;
  options?: {
    choiceLabel: string;
    choiceValue: string;
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
              prompt: "Country",
              format: "default",
              key: "address.country",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Address Name",
              format: "default",
              key: "address.name",
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
                  choiceValue: "1",
                  choiceSubtitle:
                    "I have never touched a 3D printer or designed anything.",
                },
                {
                  choiceLabel: "Intermediate",
                  choiceValue: "2",
                  choiceSubtitle:
                    "I have interacted with a 3D printer and have created a design.",
                },
                {
                  choiceLabel: "Expert",
                  choiceValue: "3",
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
                  choiceLabel: "Bambu Lab P1S",
                  choiceValue: "bambu"
                },
                {
                  choiceLabel: "Creality K1",
                  choiceValue: "creality"
                },
                {
                  choiceLabel: "Sovol SV07",
                  choiceValue: "sovol"
                },
                {
                  choiceLabel: "Elegoo Mars 2",
                  choiceValue: "elegoo"
                },
                {
                  choiceLabel: "Prusa MK4",
                  choiceValue: "prusa"
                },
                {
                  choiceLabel: "Other +",
                  choiceValue: "other"
                },
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
  const [login] = authApi.useLoginMutation();
  const dispatch = useStateDispatch(); 
  const [experience, setExperience] = useState<ExperienceLevel>(1);

  const onSubmit = (data: FieldValues) => {
    // create new user object
    const newUser: User = {
      id: '',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      addresses: [
        {
          line1: data.address.line1,
          line2: data.address.line2,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
          country: data.address.country,
          name: data.address.name,
        },
      ],
      phoneNumber: {
        countryCode: data.phoneNumber.countryCode,
        number: data.phoneNumber.number,
      },
      experience: experience,
      printers: data.printer,
      socialProvider: 'NONE'
    };

    createUser(newUser)
      .unwrap()
      .then(() => {
        login({ email: data.email, password: data.password })
          .unwrap()
          .then((res) => {
            dispatch(setUser(res));
            router.navigate({ to: '/protected' })
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "experience": {
          const selectedExperience = parseInt(e.target.value, 10) as ExperienceLevel;
          setExperience(selectedExperience);
          break;
        }
    }
  }

  const currentSection: FormSection = questions.sections[currentSectionIndex];
  const renderQuestions = () => {
    return (
      <Auth authRoute={false}>
        <div className="flex flex-col justify-center min-w-[300px]">
          <h2 className="text-xl text-center font-semibold">{currentSection?.sectionTitle}</h2>
          {currentSection?.questionGroups.map((group) => (
            <div className="flex">
              {group.questions?.map((question) => (
                <Controller
                  key={question.key + "cont"}
                  name={question.key}
                  control={control}
                  render={({ field }) => {
                    switch (question.format) {
                      case "selection":
                        return (
                          <ul className="flex flex-grow flex-col m-2">
                            {question.options?.map((option) => (
                              <li className=" m-2">
                                <input
                                  onChange={(e) => handleSelection(e)}
                                  type={question.type}
                                  id={option.choiceValue}
                                  value={option.choiceValue}
                                  className="hidden peer"
                                  key={option.choiceValue}
                                  name={question.key}
                                ></input>
                                <label
                                  htmlFor={option.choiceValue}
                                  className={`inline-flex items-center ${option.choiceSubtitle ? "justify-between" : "justify-center"} w-full p-5 cursor-pointer outline outline-[0.5px] rounded-md peer-checked:bg-primary peer-checked:bg-opacity-10 hover:bg-primary hover:bg-opacity-5`}
                                >
                                  <div className="block p-4">
                                    <div className={"w-full text-lg font-normal"}>
                                      {option.choiceLabel}
                                    </div>
                                    <div className="w-full text-sm font-light">
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
                            <label className=" py-1 font-normal">{question.prompt}</label>
                            <input
                              {...field}
                              className=" outline outline-[0.5px] p-2 rounded-sm"
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
      </Auth>
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
    <div className="flex justify-center items-center pt-32">
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderQuestions()} {renderButtons()}
      </form>
    </div>
  );
};
export default QuestionForm;
