import Status from "./Status/Status";

export default interface Job {
    job: {
    id?: string;
    designerId?: string;
    producerId?: string;
    designId?: string;
    status?: Status;
    price?: number;
    color?: string;
    filament?: String;
    dimensions?: Dimensions;
    scale?: number;
    name?: string; 
  }
}

export interface Dimensions {
    height?: number;
    width?: number;
    depth?: number;
  }

  
  