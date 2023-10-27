import { useState, useRef } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { authApi, userApi } from "../api/api.ts";
import { ExperienceLevel, User } from "../main.types.ts";
import router from "../router.tsx";
import { useStateDispatch } from "../hooks/use-redux.ts";
import { setUser } from "../store/userSlice.ts";
import Auth from "../components/Auth/Auth.tsx";

// Question being asked
type FormQuestion = {
  prompt?: string;
  format: string;
  key: string;
  rules?: object;
  type?: string;
  defaultOption?: string;
  options?: {
    choiceLabel: string;
    choiceValue: string | number;
    choiceSubtitle?: string;
    default?: boolean;
  }[];
};

// Groups of questions that are displayed in the same line
type QuestionGroup = {
  questions?: FormQuestion[];
};

// Each "page" of the form
type FormSection = {
  userType?: string;
  sectionTitle: string;
  questionGroups: QuestionGroup[];
};

// Parent form type with sections
type MultiForm = {
  sections: FormSection[];
};

// Current questions for user registrations
const allQuestions: MultiForm = {
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
              defaultOption: "designer",
              rules: { required: true },
              options: [
                {
                  choiceLabel: "I'm a Producer",
                  choiceValue: "producer",
                },
                {
                  choiceLabel: "I'm a Designer",
                  choiceValue: "designer",
                  default: true,
                },
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
              rules: {
                required: { value: true, message: "Required" },
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              },
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
              rules: {
                required: true,
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              },
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
              rules: {
                required: true,
                minLength: { value: 2, message: "min length is 2" },
              },
              type: "text",
            },
            {
              prompt: "Last Name",
              format: "default",
              key: "lastName",
              rules: {
                required: true,
                minLength: { value: 2, message: "min length is 2" },
              },
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
              rules: {
                required: true,
                minLength: { value: 2, message: "min length is 2" },
              },
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
              rules: {
                required: true,
                minLength: { value: 1, message: "Min length of 1" },
              },
              type: "text",
            },
            {
              prompt: "Phone Number",
              format: "default",
              key: "phoneNumber.number",
              rules: {
                required: true,
                minLength: { value: 10, message: "Must be 10 digits" },
                maxLength: { value: 10, message: "Must be 10 digits" },
              },
              type: "number",
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
              rules: {
                required: true,
              },
              defaultOption: "1",
              options: [
                {
                  choiceLabel: "Beginner",
                  choiceValue: 1,
                  choiceSubtitle:
                    "I have never touched a 3D printer or designed anything.",
                  default: true,
                },
                {
                  choiceLabel: "Intermediate",
                  choiceValue: 2,
                  choiceSubtitle:
                    "I have interacted with a 3D printer and have created a design.",
                },
                {
                  choiceLabel: "Expert",
                  choiceValue: 3,
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
      userType: "producer",
      sectionTitle: "What kind of 3D printers do you own?",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Printers",
              key: "printers",
              format: "selection",
              type: "radio",
              rules: { required: true },
              defaultOption: "other",
              options: [
                {
                  choiceLabel: "Bambu Lab P1S",
                  choiceValue: "bambu",
                },
                {
                  choiceLabel: "Creality K1",
                  choiceValue: "creality",
                },
                {
                  choiceLabel: "Sovol SV07",
                  choiceValue: "sovol",
                },
                {
                  choiceLabel: "Elegoo Mars 2",
                  choiceValue: "elegoo",
                },
                {
                  choiceLabel: "Prusa MK4",
                  choiceValue: "prusa",
                },
                {
                  choiceLabel: "Other +",
                  choiceValue: "other",
                  default: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      userType: "producer",
      sectionTitle: "What kind of material do you use?",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Materials",
              key: "materials",
              format: "selection",
              type: "radio",
              rules: { required: true },
              defaultOption: "other",
              options: [
                {
                  choiceLabel: "Plastic",
                  choiceValue: "plastic",
                },
                {
                  choiceLabel: "Powders",
                  choiceValue: "powders",
                },
                {
                  choiceLabel: "Resin",
                  choiceValue: "resin",
                },
                {
                  choiceLabel: "Carbon Fiber",
                  choiceValue: "carbonFiber",
                },
                {
                  choiceLabel: "Other",
                  choiceValue: "other",
                  default: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "What is your shipping preference?",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Shipping",
              key: "shipping",
              format: "selection",
              type: "radio",
              rules: {
                required: true,
              },
              defaultOption: "shipping",
              options: [
                {
                  choiceLabel: "Pickup",
                  choiceValue: "pickup",
                  choiceSubtitle:
                    "I would like the item picked up by the designer",
                },
                {
                  choiceLabel: "Shipping",
                  choiceValue: "shipping",
                  choiceSubtitle:
                    "I'm open to shipping the final item to the designer",
                  default: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      userType: "producer",
      sectionTitle: "What's the scope of projects you're interested in?",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Scope",
              key: "scope",
              format: "selection",
              type: "radio",
              rules: {
                required: true,
              },
              defaultOption: "small",
              options: [
                {
                  choiceLabel: "Small",
                  choiceValue: "small",
                  choiceSubtitle: "Quick & straightforward, done within days",
                  default: true,
                },
                {
                  choiceLabel: "Medium",
                  choiceValue: "medium",
                  choiceSubtitle: "In depth, usually about 1-2 weeks",
                },
                {
                  choiceLabel: "Large",
                  choiceValue: "large",
                  choiceSubtitle: "Mass orders, can take up to 2-4 weeks",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "What kind of projects are you looking to print?",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Projects",
              key: "projects",
              format: "selection",
              type: "radio",
              rules: { required: true },
              defaultOption: "other",
              options: [
                {
                  choiceLabel: "Technology",
                  choiceValue: "technology",
                },
                {
                  choiceLabel: "Small Items",
                  choiceValue: "smallItems",
                },
                {
                  choiceLabel: "Tools",
                  choiceValue: "tools",
                },
                {
                  choiceLabel: "Electronics",
                  choiceValue: "electronics",
                },
                {
                  choiceLabel: "Keychains",
                  choiceValue: "keychains",
                },
                {
                  choiceLabel: "Other +",
                  choiceValue: "other",
                  default: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const producerQuestions = allQuestions.sections;
const designerQuestions = allQuestions.sections.filter(
  (section) => section.userType !== "producer",
);

const QuestionForm = () => {
  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: "onChange" });
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [createUser] = userApi.useCreateUserMutation();
  const [login] = authApi.useLoginMutation();
  const dispatch = useStateDispatch();
  const [totalSections, setTotalSections] = useState<number>(
    allQuestions.sections.length,
  );
  const [questions, setQuestions] = useState<FormSection[]>(
    allQuestions.sections,
  );

  const useFocus = () => {
    const htmlElRef = useRef<HTMLButtonElement>(null);
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus();
    };

    return [htmlElRef, setFocus] as const;
  };

  const [submitButtonRef, setSubmitButtonRef] = useFocus();
  const [continueButtonRef, setContinueButtonRef] = useFocus();

  console.log("errors", errors);
  console.log("valid?", isValid);

  const onSubmit = (data: FieldValues) => {
    console.log("errors:", errors);

    // create new user object
    const newUser: User = {
      id: "",
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
      experience: parseInt(data.experience, 10) as ExperienceLevel,
      socialProvider: "NONE",
    };
    console.log(newUser);

    createUser(newUser)
      .unwrap()
      .then(() => {
        login({ email: data.email, password: data.password })
          .unwrap()
          .then((res) => {
            dispatch(setUser(res));
            router.navigate({ to: "/protected" });
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
      case "userType": {
        if (e.target.value === "producer") {
          setQuestions(producerQuestions);
          setTotalSections(producerQuestions.length);
        } else {
          setQuestions(designerQuestions);
          setTotalSections(designerQuestions.length);
        }
        break;
      }
    }
  };

  const peerCheckedColors = {
    producer: "peer-checked:bg-producer",
    designer: "peer-checked:bg-designer",
    default: "peer-checked:bg-primary",
  };

  const peerCheckedOpacity = {
    100: "peer-checked:bg-opacity-100",
    10: "peer-checked:bg-opacity-10",
  };

  const hoverColors = {
    producer: "hover:bg-producer",
    designer: "hover:bg-designer",
    default: "hover:bg-primary",
  };

  const hoverOpacity = {
    50: "hover:bg-opacity-50",
    5: "hover:bg-opacity-5",
  };

  const currentSection: FormSection = questions[currentSectionIndex];

  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 lg:grid-cols-3",
    4: "grid-cols-1 lg:grid-cols-4",
  };

  const selectQuestionRender = (question: FormQuestion) => {
    return (
      <Controller
        name={question.key}
        key={question.key}
        control={control}
        rules={question.rules}
        defaultValue={getValues(question.key)}
        render={({ field: { onChange, ...field } }) => (
          <div
            className={` w-full m-2 grid ${
              question.key === "userType" && gridColumns[2]
            }
                          ${question.key === "experience" && gridColumns[1]}
                          ${question.key === "printers" && gridColumns[3]}
                          ${question.key === "filament.type" && gridColumns[3]}
                          ${question.key === "materials" && gridColumns[3]}
                          ${question.key === "shipping" && gridColumns[1]}
                          ${question.key === "scope" && gridColumns[1]}
                          ${question.key === "projects" && gridColumns[3]}
                          ${question.key !== "userType" && " gap-2"}`}
          >
            {question.options?.map((option) => (
              <div
                className={`${
                  question.key === "materials" &&
                  option.choiceValue === "other" &&
                  ""
                } ${currentSectionIndex !== 0 && "m-2"}`}
              >
                <input
                  {...field}
                  key={question.key + option.choiceValue}
                  onChange={(e) => {
                    onChange(e);
                    handleSelection(e);
                  }}
                  type={question.type}
                  id={question.key + option.choiceValue}
                  value={option.choiceValue}
                  className="hidden peer"
                  checked={option.choiceValue == getValues(question.key)}
                ></input>
                <label
                  onClick={() => {
                    setSubmitButtonRef();
                    setContinueButtonRef();
                    setTimeout(() => {
                      submitButtonRef.current &&
                        submitButtonRef.current.focus();
                      continueButtonRef.current &&
                        continueButtonRef.current.focus();
                    }, 0);
                  }}
                  htmlFor={question.key + option.choiceValue}
                  className={`inline-flex items-center ${
                    option.choiceSubtitle ? "justify-between" : "justify-center"
                  } w-full ${
                    currentSectionIndex !== 0 && " p-5"
                  } cursor-pointer outline outline-primary/50 outline-[0.5px] rounded-md
                                  ${
                                    option.choiceValue === "producer" &&
                                    `${peerCheckedColors["producer"]} ${peerCheckedOpacity["100"]} ${hoverColors["producer"]} ${hoverOpacity["50"]} peer-checked:text-background`
                                  }
                                  ${
                                    option.choiceValue === "designer" &&
                                    `${peerCheckedColors["designer"]} ${peerCheckedOpacity["100"]} ${hoverColors["designer"]} ${hoverOpacity["50"]} peer-checked:text-background`
                                  }
                                  ${
                                    option.choiceValue !== "producer" &&
                                    option.choiceValue !== "designer" &&
                                    `${peerCheckedColors["default"]} ${peerCheckedOpacity["10"]} ${hoverColors["default"]} ${hoverOpacity["5"]}`
                                  }`}
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
              </div>
            ))}
          </div>
        )}
      />
    );
  };

  const defaultQuestionRender = (question: FormQuestion) => {
    return (
      <Controller
        name={question.key}
        key={question.key}
        control={control}
        rules={question.rules}
        render={({ field: { ...field }, fieldState: { error } }) => {
          return (
            <div className="flex flex-grow flex-col m-2">
              <label className=" py-1 font-normal">
                {question.prompt}
                <span className=" text-error">
                  {question.rules && "required" in question.rules ? "*" : ""}
                </span>
                <span className=" text-error italic text-sm">
                  {" "}
                  {error ? error.message : ""}
                </span>
              </label>
              <input
                {...field}
                className=" outline outline-primary/50 outline-[0.5px] p-2 rounded-sm"
                type={question.type}
                key={question.key}
              />
            </div>
          );
        }}
      />
    );
  };

  const renderQuestions = () => {
    return (
      <Auth authRoute={false}>
        <div className="flex flex-col justify-center lg:min-w-[450px]">
          <h2
            className={`text-xl text-center font-semibold mb-6 ${
              currentSectionIndex !== 0 && "mt-10"
            }`}
          >
            {currentSection?.sectionTitle}
          </h2>
          {currentSection?.questionGroups.map((group) => (
            <div className="flex flex-wrap lg:flex-nowrap">
              {group.questions?.map((question) => {
                switch (question.format) {
                  case "selection":
                    return selectQuestionRender(question);
                  default:
                    return defaultQuestionRender(question);
                }
              })}
            </div>
          ))}
        </div>
      </Auth>
    );
  };

  // Go to next section
  const handleNext = () => {
    console.log("errors:", errors);
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);

      trigger();
    }
  };

  // Go to previous section
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);

      trigger();
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="flex space-x-1 self-center">
        {Array.from(Array(totalSections).keys()).map((index) => {
          return (
            <div
              className={`w-3 h-[2px] bg-producer ${
                currentSectionIndex === index ? "opacity-100" : "opacity-50"
              } rounded-full`}
            ></div>
          );
        })}
      </div>
    );
  };

  // Only show appropriate buttons based on section index
  const renderButtons = () => {
    return (
      <div className="m-2 mt-4 flex justify-between" key="top">
        {currentSectionIndex === 0 && (
          <div className="py-4 w-full" key="create">
            <button
              className=" bg-primary disabled:bg-primary/50 text-background rounded-lg p-3 w-full"
              type="button"
              disabled={!isValid || !isDirty}
              onClick={handleNext}
            >
              Create Account
            </button>
          </div>
        )}
        {currentSectionIndex > 0 && (
          <div className=" float-left py-4 self-start" key="previous">
            <button
              className=" bg-primary bg-opacity-5 text-primary rounded-lg p-3 w-24"
              type="button"
              onClick={handlePrevious}
            >
              Back
            </button>
          </div>
        )}
        {currentSectionIndex > 0 && renderProgressBar()}
        {currentSectionIndex < totalSections - 1 && currentSectionIndex > 0 && (
          <div className=" float-right py-4" key="continue">
            <button
              className=" bg-primary disabled:bg-primary/50 text-background rounded-lg p-3 w-24"
              type="button"
              disabled={!isValid || !isDirty}
              onClick={handleNext}
              ref={continueButtonRef}
            >
              Continue
            </button>
          </div>
        )}
        {currentSectionIndex == totalSections - 1 && (
          <div className=" float-right py-4" key="enter">
            <button
              className=" bg-primary disabled:bg-primary/50 text-background rounded-lg p-3 w-24"
              type="submit"
              disabled={!isValid || !isDirty}
              ref={submitButtonRef}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!isValid || !isDirty) return;
      if (currentSectionIndex < totalSections - 1) {
        handleNext();
      } else if (currentSectionIndex === totalSections - 1) {
        handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <div className="flex justify-center h-full items-center">
      {currentSectionIndex === 0 && (
        <div className=" hidden h-full w-3/5 lg:flex justify-center items-center">
          <img src="src/assets/registration.png" className=" p-32" />
        </div>
      )}
      <div
        className={`flex justify-center h-full ${
          currentSectionIndex === 0 && "lg:w-2/5 items-center"
        }`}
      >
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyPress}>
          {renderQuestions()}
          {renderButtons()}
        </form>
      </div>
    </div>
  );
};
export default QuestionForm;
