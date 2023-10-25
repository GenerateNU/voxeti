import { useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { authApi, userApi } from "../api/api.ts";
import { User } from "../main.types.ts";
import { ExperienceLevel, Printer, FilamentType } from "../main.types.ts";
import router from "../router.tsx";
import { useStateDispatch } from "../hooks/use-redux.ts";
import { setUser } from "../store/userSlice.ts";
import Auth from "../components/Auth/Auth.tsx";
import { commonPrinters } from "../utilities/commonPrinters.ts";

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
                  choiceLabel: "I'm a Producer",
                  choiceValue: "producer",
                },
                {
                  choiceLabel: "I'm a Designer",
                  choiceValue: "designer",
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
              key: "printers",
              format: "selection",
              type: "checkbox",
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
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "Add your first filament!",
      questionGroups: [
        {
          questions: [
            {
              prompt: "Filament",
              key: "filament.type",
              format: "selection",
              type: "radio",
              options: [
                {
                  choiceLabel: "PLA",
                  choiceValue: "PLA",
                },
                {
                  choiceLabel: "ABS",
                  choiceValue: "ABS",
                },
                {
                  choiceLabel: "TPE",
                  choiceValue: "TPE",
                },
              ],
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Color",
              format: "default",
              key: "filament.color",
              rules: { required: true },
              type: "text",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Cost Per Kilogram",
              format: "default",
              key: "filament.pricePerUnit",
              rules: { required: true },
              type: "text",
            },
          ],
        },
      ],
    },
  ],
};

const QuestionForm = () => {
  const { control, handleSubmit, reset } = useForm();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [createUser] = userApi.useCreateUserMutation();
  const [login] = authApi.useLoginMutation();
  const dispatch = useStateDispatch();
  const [experience, setExperience] = useState<ExperienceLevel>(1);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [totalSections, setTotalSections] = useState<number>(
    questions.sections.length,
  );
  const [filamentType, setFilamentType] = useState<FilamentType>("PLA");

  const onSubmit = (data: FieldValues) => {
    // remove name from each printer
    printers.forEach((printer) => {
      delete printer.name;
    });

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
      experience: experience,
      printers: printers,
      availableFilament:
        data.filament !== undefined
          ? [
              {
                type: filamentType,
                color: data.filament.color,
                pricePerUnit: parseInt(data.filament.pricePerUnit, 10),
              },
            ]
          : [],
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
      case "experience": {
        const selectedExperience = parseInt(
          e.target.value,
          10,
        ) as ExperienceLevel;
        setExperience(selectedExperience);
        break;
      }
      case "printers": {
        const selectedPrinterName = e.target.value;
        // use filter to try to remove printer if it has same name as selectedPrinterName
        const filteredPrinters = printers.filter(
          (printer) => printer.name !== selectedPrinterName,
        );
        // if filter removed a printer, then set printers to filteredPrinters
        if (filteredPrinters.length !== printers.length) {
          setPrinters(filteredPrinters);
          break;
        } else {
          // else add printer to printers
          const selectedPrinter = commonPrinters.find(
            (printer) => printer.name === selectedPrinterName,
          );

          if (selectedPrinter !== undefined) {
            setPrinters([...printers, selectedPrinter]);
          }
        }
        break;
      }
      case "userType": {
        if (e.target.value === "producer") {
          setTotalSections(questions.sections.length);
        } else {
          setTotalSections(questions.sections.length - 2);
        }

        reset();
        break;
      }
      case "filament.type": {
        setFilamentType(e.target.value as FilamentType);
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

  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };

  const currentSection: FormSection = questions.sections[currentSectionIndex];
  const renderQuestions = () => {
    return (
      <Auth authRoute={false}>
        <div className="flex flex-col justify-center lg:min-w-[450px]">
          <h2 className="text-xl text-center font-semibold m-2">
            {currentSection?.sectionTitle}
          </h2>
          {currentSection?.questionGroups.map((group) => (
            <div className="flex flex-wrap lg:flex-nowrap">
              {group.questions?.map((question) => (
                <Controller
                  key={question.key + "cont"}
                  name={question.key}
                  control={control}
                  render={({ field }) => {
                    switch (question.format) {
                      case "selection":
                        return (
                          <div
                            className={` w-full m-2 grid ${
                              question.key === "userType" && gridColumns[2]
                            }
                          ${question.key === "experience" && gridColumns[1]}
                          ${question.key === "printers" && gridColumns[3]}
                          ${question.key === "filament.type" && gridColumns[3]}
                          ${question.key !== "userType" && " gap-2"}`}
                          >
                            {question.options?.map((option) => (
                              <div
                                className={`${
                                  currentSectionIndex !== 0 && "m-2"
                                }`}
                              >
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
                                  className={`inline-flex items-center ${
                                    option.choiceSubtitle
                                      ? "justify-between"
                                      : "justify-center"
                                  } w-full ${
                                    question.key !== "userType" &&
                                    question.key !== "filament.type" &&
                                    " p-5"
                                  }
                                  cursor-pointer outline outline-[0.5px] rounded-md
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
                                    <div
                                      className={"w-full text-lg font-normal"}
                                    >
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
                        );
                      default:
                        return (
                          <div className="flex flex-grow flex-col m-2">
                            <label className=" py-1 font-normal">
                              {question.prompt}
                            </label>
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
    if (currentSectionIndex < totalSections - 1) {
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
      <div className="m-2" key="top">
        {currentSectionIndex === 0 && (
          <div className="py-4" key="create">
            <button
              className=" bg-primary text-background rounded-lg p-3 w-full"
              type="button"
              onClick={handleNext}
            >
              Create Account
            </button>
          </div>
        )}
        {currentSectionIndex > 0 && (
          <div className=" float-left py-4" key="previous">
            <button
              className=" bg-primary bg-opacity-5 text-primary rounded-lg p-3"
              type="button"
              onClick={handlePrevious}
            >
              Back
            </button>
          </div>
        )}
        {currentSectionIndex < totalSections - 1 && currentSectionIndex > 0 && (
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
        {currentSectionIndex == totalSections - 1 && (
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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (currentSectionIndex < totalSections - 1) {
        handleNext();
      } else if (currentSectionIndex === totalSections - 1) {
        handleSubmit(onSubmit);
      }
    }
  };

  return (
    <div className="flex justify-center h-full items-center">
      {currentSectionIndex === 0 && (
        <div className=" hidden bg-primary h-full w-3/5 lg:flex justify-center items-cente">
          <img src="src/assets/relaxedguy.png" className=" p-32" />
        </div>
      )}
      <div
        className={` flex items-center justify-center h-full ${
          currentSectionIndex === 0 && "lg:w-2/5"
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
