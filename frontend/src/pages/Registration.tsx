import { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { authApi, userApi } from "../api/api.ts";
import { ExperienceLevel, User } from "../main.types.ts";
import router from "../router.tsx";
import { useStateDispatch } from "../hooks/use-redux.ts";
import { setUser } from "../store/userSlice.ts";
import Auth from "../components/Auth/Auth.tsx";
import {FormSection, allQuestions } from "../utils/questions.ts";
import DefaultQuestion from "../components/Registration/DefaultQuestion.tsx"
import SelectQuestion from "../components/Registration/SelectQuestion.tsx";
import MultiQuestion from "../components/Registration/MultiQuestion.tsx";
import TextQuestion from "../components/Registration/TextQuestion.tsx";

const producerQuestions = allQuestions.sections;
const designerQuestions = allQuestions.sections.filter(
  (section) => section.userType !== "producer",
);

const QuestionForm = () => {
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    getValues,
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

  const temp:string = watch("userType");
  
  useEffect( () => {
    if (getValues("userType") === "producer") {
      setQuestions(producerQuestions);
      setTotalSections(producerQuestions.length);
    } else {
      setQuestions(designerQuestions);
      setTotalSections(designerQuestions.length);
    }
  }, [temp]);

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
            router.navigate({ to: "/" });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const currentSection: FormSection = questions[currentSectionIndex];

  const RenderQuestions = () => {
    return (
      <Auth authRoute={false} key={"Auth"}>
        <div className="flex flex-col justify-center lg:min-w-[450px] space-y-2">
          <h2
            className={`text-xl text-center font-semibold mb-6 ${
              currentSectionIndex !== 0 && "mt-10"
            }`}
          >
            {currentSection?.sectionTitle}
          </h2>
          {currentSection?.questionGroups.map((group, index) => (
            <div key={"group_" + index} 
            className="flex flex-wrap lg:flex-nowrap justify-center">
              {group.questions?.map((question) => {
                switch (question.format) {
                  case "selection":
                    return (<SelectQuestion key={question.key  + "master"} question={question} control={control}/>);
                  case "multiple":
                    return (<MultiQuestion key={question.key  + "master"} question={question} control={control}/>);
                  case "text":
                    return (<TextQuestion key={question.key  + "master"} question={question} control={control}/>);
                  default:
                    return (<DefaultQuestion key={question.key  + "master"} question={question} control={control}/>);
                }
              })}
            </div>
          ))}
        </div>
      </Auth>
    );
  }

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
  const RenderButtons = () => {
    return (
      <div className="m-2 mt-4 flex justify-center space-x-4" key="top">
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
              key={"Continue_button"}
              className=" bg-primary disabled:bg-primary/50 text-background rounded-lg p-3 w-24"
              type="button"
              disabled={!isValid || !isDirty}
              onClick={handleNext}
            >
              Continue
            </button>
          </div>
        )}
        {currentSectionIndex == totalSections - 1 && (
          <div className=" float-right py-4" key="enter">
            <button
              key={"Submit_button"}
              className=" bg-primary disabled:bg-primary/50 text-background rounded-lg p-3 w-24"
              type="submit"
              disabled={!isValid || !isDirty}
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
    <div key={"Master_div"} className="flex justify-center h-full items-center">
      {currentSectionIndex === 0 && (
        <div className=" hidden h-full w-3/5 lg:flex justify-center items-center">
          <img src="src/assets/registration.png" className=" p-32" />
        </div>
      )}
      <div
        className={`flex flex-col justify-center items-center h-full w-full ${
          currentSectionIndex === 0 && "lg:w-2/5 items-center"
        }`}
      >
          <form key={"formOverhead"} onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyPress}>
            {RenderQuestions()}
          </form>
          {RenderButtons()}
      </div>
    </div>
  );
};
export default QuestionForm;
