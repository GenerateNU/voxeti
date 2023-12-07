// 1. Key Schema:

// A Voxeti User, can be both a Designer and a Producer
export interface User {
  id: string;
  userType?: 'DESIGNER' | 'PRODUCER' | 'HYBRID',
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  addresses: Address[];
  phoneNumber: PhoneNumber;
  experience: ExperienceLevel;
  printers?: Printer[];
  availableFilament?: Filament[];
  socialProvider: SocialProvider;
}

// A Voxeti print Job
export interface Job {
  id?: string;
  createdAt: Date;
  designerId: string;
  producerId?: string;
  designId: string[];
  quantity: number[];
  status: JobStatus;
  price: number;
  shipping: number;
  taxes: number;
  color: string;
  filament: FilamentType;
  layerHeight: number;
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

// A Design is just a GridFS file, but renamed to match Voxeti branding
export interface Design {
  id: string;
  name: string;
  length: number;
}

// 2. Supporting Schema:

// Address location
export type Geometry = {
  type: string;
  coordinates: number[];
};

// An address
export type Address = {
  name: string;
  line1: string;
  line2?: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  location?: Geometry;
};

// Print/printer physical dimensions
export type Dimensions = {
  height: number;
  width: number;
  depth: number;
};

// A filament
export type Filament = {
  type: FilamentType;
  color: string;
  pricePerUnit: number;
};

// A 3D printer
export type Printer = {
  name?: string;
  supportedFilament: FilamentType[];
  dimensions: Dimensions;
};

// A phone number
export type PhoneNumber = {
  countryCode: string;
  number: string;
};

// 3. Enums:

// The status of a job:
export type JobStatus =
  | "PENDING"
  | "ACCEPTED"
  | "INPROGRESS"
  | "INSHIPPING"
  | "COMPLETE";

// The type of a filament:
export type FilamentType = "PLA" | "ABS" | "TPE";

// The experience level of a user:
export type ExperienceLevel = 1 | 2 | 3;

export type SocialProvider = "NONE" | "GOOGLE";

// 4. Extra Types:

export type Error = {
  code: number;
  message: string;
};

export enum PageStatus {
  Success,
  Loading,
  Error,
}

export type SSOQueryParams = {
  user: string;
  provider: SocialProvider;
};

export const NEW_USER_ID = "000000000000000000000000"
