import { countries } from "./DropdownItems/countries";
import { countryCodes } from "./DropdownItems/countryDialCodes";

// Question being asked
export type FormQuestion = {
  prompt?: string;
  format: string;
  key: string;
  rules?: object;
  type?: string;
  defaultOption?: string;
  defaultValue?: string;
  gridPattern?: string;
  disabled?: boolean;
  menuItems?: Array<object>;
  options?: {
    choiceLabel: string;
    selectedColor?: string;
    choiceValue: string | number;
    choiceSubtitle?: string;
    hoverColor?: string;
    default?: boolean;
  }[];
};

// Groups of questions that are displayed in the same line
export type QuestionGroup = {
  questions?: FormQuestion[];
};

// Each "page" of the form
export type FormSection = {
  userType?: string;
  sectionTitle: string;
  questionGroups: QuestionGroup[];
};

// Parent form type with sections
export type MultiForm = {
  sections: FormSection[];
};

// Current questions for user registrations
export const allQuestions: MultiForm = {
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
              defaultOption: "DESIGNER",
              rules: { required: true },
              options: [
                {
                  choiceLabel: "I'm a producer",
                  choiceValue: "PRODUCER",
                  selectedColor: `!bg-producer`,
                  hoverColor: "hover:!bg-producer",
                },
                {
                  choiceLabel: "I'm a designer",
                  choiceValue: "DESIGNER",
                  selectedColor: `!bg-designer`,
                  hoverColor: "hover:!bg-designer",
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
              format: "text",
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
              format: "text",
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
              format: "text",
              key: "firstName",
              rules: {
                required: { value: true, message: "First name is required!" },
              },
              type: "text",
            },
            {
              prompt: "Last Name",
              format: "text",
              key: "lastName",
              rules: {
                required: { value: true, message: "Last name is required!" },
              },
              type: "text",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Address",
              format: "text",
              key: "address.line1",
              rules: {
                required: { value: true, message: "Address is required!" },
              },
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Apartment, suite, etc. (Optional)",
              format: "text",
              key: "address.line2",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "City",
              format: "text",
              key: "address.city",
              rules: {
                required: { value: true, message: "City is required!" },
              },
              type: "text",
            },
            {
              prompt: "State",
              format: "text",
              key: "address.state",
              rules: {
                required: { value: true, message: "State is required!" },
              },
              type: "text",
            },
            {
              prompt: "Zip",
              format: "text",
              key: "address.zipCode",
              rules: {
                required: { value: true, message: "Zip code is required!" },
                minLength: { value: 5, message: "Invalid zip code" },
                maxLength: { value: 5, message: "Invalid zip code" },
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Invalid zip code",
                },
              },
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Country",
              format: "dropdown",
              key: "address.country",
              rules: { required: true },
              menuItems: countries,
              type: "text",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Code",
              format: "dropdown",
              key: "phoneNumber.countryCode",
              rules: { required: true },
              menuItems: countryCodes,
              type: "text",
            },
            {
              prompt: "Phone Number",
              format: "text",
              key: "phoneNumber.number",
              rules: {
                required: { value: true, message: "Phone number is required!" },
                pattern: {
                  value: /^[0-9]*$/,
                  message: "numbers only please",
                },
                minLength: { value: 10, message: "Must be 10 digits" },
                maxLength: { value: 10, message: "Must be 10 digits" },
              },
              type: "number",
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
              gridPattern:
                "!grid !grid-cols-1 lg:!w-[40vw] !grid-rows-3 !gap-6",
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
              format: "multiple",
              type: "radio",
              rules: { required: true },
              defaultOption: "other",
              gridPattern:
                "!grid !grid-cols-2 md:!grid-cols-3 lg:!w-[40vw] !grid-rows-2 !gap-6",
              options: [
                {
                  choiceLabel: "Creality Ender 3 V2",
                  choiceValue: "Creality Ender 3 V2",
                },
                {
                  choiceLabel: "Prusa MK4",
                  choiceValue: "Prusa MK4",
                },
                {
                  choiceLabel: "Sovol SV01",
                  choiceValue: "Sovol SV01",
                },
                {
                  choiceLabel: "Creality K1 Max",
                  choiceValue: "Creality K1 Max",
                },
                {
                  choiceLabel: "Bambu Lab P1S",
                  choiceValue: "Bambu Lab P1S",
                },
                {
                  choiceLabel: "Add Later",
                  choiceValue: "Add Later",
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
              format: "multiple",
              type: "radio",
              rules: { required: true },
              defaultOption: "other",
              gridPattern:
                "!grid !grid-cols-2 md:!grid-cols-3 lg:!w-[40vw] !grid-rows-2 !gap-6",
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
                {
                  choiceLabel: "Nylon",
                  choiceValue: "NYLON",
                },
                {
                  choiceLabel: "Other",
                  choiceValue: "OTHER",
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
              gridPattern:
                "!grid !grid-cols-1 lg:!w-[40vw] !grid-rows-2 !gap-6",
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
              gridPattern:
                "!grid !grid-cols-1 lg:!w-[40vw] !grid-rows-3 !gap-6",
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
              format: "multiple",
              type: "radio",
              rules: { required: true },
              defaultOption: "other",
              gridPattern:
                "!grid !grid-cols-2 md:!grid-cols-3 lg:!w-[40vw] !grid-rows-2 !gap-6",
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
