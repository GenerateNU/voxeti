import { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { authApi, userApi } from "../api/api.ts";
import {
  ExperienceLevel,
  Filament,
  SSOQueryParams,
  User,
} from "../main.types.ts";
import router from "../router.tsx";
import { useStateDispatch, useStateSelector } from "../hooks/use-redux.ts";
import { setUser } from "../store/userSlice.ts";
import Auth from "../components/Auth/Auth.tsx";
import {
  FormSection,
  allQuestions,
} from "../utilities/FormQuestions/registration.ts";
import SelectQuestion from "../components/Registration/SelectQuestion.tsx";
import MultiQuestion from "../components/Registration/MultiQuestion.tsx";
import TextQuestion from "../components/Registration/TextQuestion.tsx";
import StyledButton from "../components/Button/Button.tsx";
import DropdownQuestion from "../components/Registration/DropdownQuestion.tsx";
import presets from "../../../presets.json";
import { Printer } from "../main.types.ts";
import { useApiError } from "../hooks/use-api-error.tsx";

const producerQuestions = allQuestions.sections;
const designerQuestions = allQuestions.sections.filter(
  (section) => section.userType?.toLowerCase() !== "producer"
);

const QuestionForm = () => {
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { isValid, isDirty },
  } = useForm({ mode: "onChange" });

  // Handle sso registration:
  const { user: ssoEmail, provider } = router.state.location
    .search as SSOQueryParams;
  const { ssoAccessToken } = useStateSelector((state) => state.user);
  const [googleSSO] = authApi.useGoogleSSOMutation();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [createUser] = userApi.useCreateUserMutation();
  const [login] = authApi.useLoginMutation();
  const dispatch = useStateDispatch();
  const [totalSections, setTotalSections] = useState<number>(
    allQuestions.sections.length
  );
  const [questions, setQuestions] = useState<FormSection[]>(
    allQuestions.sections
  );

  const { addError, setOpen } = useApiError()

  const temp: string = watch("userType");

  useEffect(() => {
    if (temp === "PRODUCER") {
      setQuestions(producerQuestions);
      setTotalSections(producerQuestions.length);
    } else {
      setQuestions(designerQuestions);
      setTotalSections(designerQuestions.length);
    }
  }, [temp]);

  const onSubmit = (data: FieldValues) => {
    const printers: Printer[] = !data.printers
      ? []
      : data.printers
          .map((name: string) => {
            return presets[name as keyof typeof presets];
          })
          .filter((element: Printer | undefined) => {
            return element !== undefined;
          });

    const filaments: Filament[] = !data.materials
      ? []
      : data.materials
          .map((type: string) => {
            if (["PLA", "ABS", "TPE"].includes(type))
              return {
                type: type,
                color: "White",
                pricePerUnit: 2000,
              };
          })
          .filter((element: Filament | undefined) => {
            return element !== undefined;
          });

    // create new user object
    const newUser: User = {
      id: "",
      userType: data.userType,
      firstName: data.firstName,
      lastName: data.lastName,
      email: ssoEmail ?? data.email,
      password: data.password ?? "",
      addresses: [
        {
          line1: data.address.line1,
          line2: data.address.line2,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
          country: data.address.country,
          name: "Primary",
        },
      ],
      phoneNumber: {
        countryCode: data.phoneNumber.countryCode,
        number: data.phoneNumber.number,
      },
      experience: parseInt(data.experience, 10) as ExperienceLevel,
      socialProvider: provider ?? "NONE",
      printers: printers ?? [],
      availableFilament: filaments ?? [],
    };

    createUser(newUser)
      .unwrap()
      .then(() => {
        if (newUser.socialProvider === "NONE") {
          login({ email: data.email, password: data.password })
            .unwrap()
            .then((res) => {
              dispatch(setUser(res));
              router.navigate({ to: "/" });
            })
            .catch(() => {
              addError("Something went wrong, please try again")
              setOpen(true)
            });
        } else {
          googleSSO(ssoAccessToken)
            .unwrap()
            .then((res) => {
              dispatch(setUser(res));
              router.navigate({ to: "/" });
            })
            .catch((err) => {
              addError(err)
              setOpen(true)
            });
        }
      })
      .catch((err) => {
        addError(err)
        setOpen(true)
      });
  };

  const currentSection: FormSection = questions[currentSectionIndex];

  const RenderQuestions = () => {
    return (
      <div
        className={`flex flex-col justify-center lg:min-w-[${
          currentSectionIndex !== 0 ? "40vw" : "450px"
        }] space-y-2`}
      >
        <h2
          className={`text-2xl md:text-3xl text-center font-bold font-display mb-12 ${
            currentSectionIndex !== 0 && "mt-8"
          }`}
        >
          {currentSection?.sectionTitle}
        </h2>
        {currentSection?.questionGroups.map((group, index) => (
          <div
            key={"group_" + index}
            className="flex flex-wrap lg:flex-nowrap justify-center gap-x-4"
          >
            {group.questions?.map((question) => {
              if (ssoEmail) {
                if (question.key === "password") {
                  return;
                } else if (question.key === "email") {
                  question.disabled = true;
                  question.defaultValue = ssoEmail;
                  question.rules = {};
                }
              }

              switch (question.format) {
                case "selection":
                  return (
                    <SelectQuestion
                      key={question.key + "master"}
                      question={question}
                      control={control}
                      userType={temp}
                    />
                  );
                case "multiple":
                  return (
                    <MultiQuestion
                      key={question.key + "master"}
                      question={question}
                      control={control}
                      userType={temp}
                    />
                  );
                case "text":
                  return (
                    <TextQuestion
                      key={question.key + "master"}
                      question={question}
                      control={control}
                    />
                  );
                case "dropdown":
                  return (
                    <DropdownQuestion
                      key={question.key + "master"}
                      question={question}
                      control={control}
                    />
                  );
                default:
                  return <>Something went wrong here</>;
              }
            })}
          </div>
        ))}
      </div>
    );
  };

  // Go to next section
  const handleNext = () => {
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
              key={"section" + index}
              className={`w-2 md:w-6 h-[3px] md:h-[2px] ${
                temp === "PRODUCER" ? "bg-producer" : "bg-designer"
              } ${
                currentSectionIndex === index ? "opacity-100" : "opacity-50"
              } rounded-full`}
            ></div>
          );
        })}
      </div>
    );
  };

  // Only show appropriate buttons based on section index
  const RenderButtons = () => {
    return (
      <div
        className={`mt-4 flex ${
          currentSectionIndex !== 0 &&
          "justify-between lg:absolute lg:bottom-6 right-0 left-0 space-x-4"
        }`}
        key="top"
      >
        {currentSectionIndex === 0 && (
          <div className="py-4 w-full" key="create">
            <StyledButton
              color="primary"
              disabled={ssoEmail ? !temp : !isValid || !isDirty}
              onClick={handleNext}
            >
              Create Account
            </StyledButton>
          </div>
        )}
        {currentSectionIndex > 0 && (
          <div className=" float-left py-4 self-start" key="previous">
            <StyledButton
              size="sm"
              color="seconday"
              type="button"
              onClick={handlePrevious}
            >
              Back
            </StyledButton>
          </div>
        )}
        {currentSectionIndex > 0 && renderProgressBar()}
        {currentSectionIndex < totalSections - 1 && currentSectionIndex > 0 && (
          <div className=" float-right py-4" key="continue">
            <StyledButton
              size="sm"
              type="button"
              color="primary"
              disabled={!isValid || !isDirty}
              onClick={handleNext}
            >
              Continue
            </StyledButton>
          </div>
        )}
        {currentSectionIndex == totalSections - 1 && (
          <div className=" float-right py-4" key="enter">
            <StyledButton
              size="sm"
              color="primary"
              type="submit"
              disabled={!isValid || !isDirty}
            >
              Submit
            </StyledButton>
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
    <Auth authRoute={false}>
      <div
        key={"Master_div"}
        className="flex justify-center h-full items-center"
      >
        {currentSectionIndex === 0 && (
          <div className="hidden h-full w-3/5 lg:flex justify-center items-center">
            <img src="src/assets/registration.png" className="w-[60%]" />
          </div>
        )}
        <div
          className={`flex flex-col flex-grow justify-center items-center lg:h-[100vh] min-h-[700px] w-full ${
            currentSectionIndex === 0 && "lg:w-2/5 items-center"
          }`}
        >
          <form
            key={"formOverhead"}
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={handleKeyPress}
            className="h-full flex flex-col justify-center relative p-5 md:p-0 mt-20 lg:mt-0"
          >
            {RenderQuestions()}
            {RenderButtons()}
          </form>
        </div>
      </div>
    </Auth>
  );
};
export default QuestionForm;
