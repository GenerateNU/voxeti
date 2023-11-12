
// Question being asked
export type FormQuestion = {
  prompt?: string;
  format: string;
  key: string;
  rules?: object;
  type?: string;
  defaultOption?: string;
  gridPattern?: string;
  options?: {
    choiceLabel: string;
    selectedColor?: string;
    choiceValue: string | number;
    choiceSubtitle?: string;
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
              defaultOption: "designer",
              rules: { required: true },
              options: [
                {
                  choiceLabel: "I'm a Producer",
                  choiceValue: "producer",
                  selectedColor: `!bg-producer`
                },
                {
                  choiceLabel: "I'm a Designer",
                  choiceValue: "designer",
                  selectedColor: `!bg-designer`,
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
                required: true,
                minLength: { value: 2, message: "min length is 2" },
              },
              type: "text",
            },
            {
              prompt: "Last Name",
              format: "text",
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
              format: "text",
              key: "bio",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Address Line 1",
              format: "text",
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
              format: "text",
              key: "address.line2",
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Country Code",
              format: "text",
              key: "phoneNumber.countryCode",
              rules: {
                required: true,
                pattern: {
                  value: /^[0-9]*$/,
                  message: "numbers only please",
                },
                minLength: { value: 1, message: "Min length of 1" },
              },
              type: "text",
            },
            {
              prompt: "Phone Number",
              format: "text",
              key: "phoneNumber.number",
              rules: {
                required: true,
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
        {
          questions: [
            {
              prompt: "City",
              format: "text",
              key: "address.city",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "State",
              format: "text",
              key: "address.state",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Zip",
              format: "text",
              key: "address.zipCode",
              rules: {
                required: true,
                pattern: {
                  value: /^[0-9]*$/,
                  message: "numbers only please",
                },
              },
            },
          ],
        },
        {
          questions: [
            {
              prompt: "Country",
              format: "text",
              key: "address.country",
              rules: { required: true },
              type: "text",
            },
            {
              prompt: "Address Name",
              format: "text",
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
              gridPattern: '!grid !grid-cols-1 !grid-rows-3 !gap-4',
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
              gridPattern: '!grid !grid-cols-3 !grid-rows-2 !gap-4',
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
              format: "multiple",
              type: "radio",
              rules: { required: true },
              defaultOption: "other",
              gridPattern: '!grid !grid-cols-3 !grid-rows-2 !gap-4',
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
              gridPattern: '!grid !grid-cols-1 !grid-rows-2 !gap-4',
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
              gridPattern: '!grid !grid-cols-1 !grid-rows-3 !gap-4',
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
              gridPattern: '!grid !grid-cols-3 !grid-rows-2 !gap-4',
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