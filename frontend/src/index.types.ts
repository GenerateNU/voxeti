// 1. Key Schema:

// A Voxeti User, can be both a Designer and a Producer
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  addresses: Address[];
  phoneNumber: PhoneNumber;
  experience?: ExperienceLevel;
  printers?: Printer[];
  availableFilament?: Filament[];
}

// A Voxeti print Job
export interface Job {
  id: string;
  designerId: string;
  producerId: string;
  designId: string;
  status: JobStatus;
  price: number;
  color: string;
  filament: FilamentType;
}

// A Design is just a GridFS file, but renamed to match Voxeti branding
export interface Design {
  id: string;
  name: string;
  length: number;
}

// 2. Supporting Schema: 

// Address coordinates
export type Coordinates = {
  latitude: number;
  longitude: number;
}

// An address
export type Address = {
  name: string;
  line1: string;
  line2: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  location: Coordinates;
}

// Print/printer physical dimensions
export type Dimensions = {
  height: number;
  width: number;
  depth: number;
}

// A filament
export type Filament = {
  type: FilamentType;
  color: string;
  pricePerUnit: number;
}

// A 3D printer
export type Printer = {
  supportedFilament: FilamentType[];
  dimensions: Dimensions[];
}

// A phone number
export type PhoneNumber = {
  areaCode: string;
  number: string;
}

// 3. Enums:

// The status of a job:
export type JobStatus = 'PENDING' | 'ACCEPTED' | 'INPROGRESS' | 'INSHIPPING' | 'COMPLETE';

// The type of a filament:
export type FilamentType = 'PLA' | 'ABS' | 'TPE';

// The experience level of a user:
export type ExperienceLevel = 0 | 1 | 2
