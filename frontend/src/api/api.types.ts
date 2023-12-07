import { Job } from "../main.types";

// User credentials:
export type UserCredentials = {
  email: string;
  password: string;
};

// Google SSO Response:
export type ProviderUser = {
  user: string;
  userType: "new" | "existing";
  provider: "GOOGLE";
};

// Slicer Response:
export type SlicerData = {
  fileName: string;
  quantity: number;
  flavor: string;
  time: number;
  filamentUsed: number;
  layerHeight: number;
  minx: number;
  miny: number;
  minz: number;
  maxx: number;
  maxy: number;
  maxz: number;
  targetMachineName: string;
}

export type PriceEstimation = {
  shipping: boolean,
  filamentType: string,
  slices: SlicerData[],
}

export type EstimateBreakdown = {
  file: string,
  baseCost: number,
  timeCost: number,
  filamentCost: number,
  shippingCost: number,
  producerSubtotal: number,
  producerFee: number,
  producerTotal: number,
  taxCost: number,
  stripeCost: number,
  voxetiCost: number,
  total: number,
}

export type VoxetiJob = {
  id: string,
  job: Job,
}

export type CheckoutState = {
  prices: EstimateBreakdown[];
  quantities: number[];
};

export type CheckoutSessionData = {
  client_secret: string;
};