export interface CustomGroup {
  name?: string;
  description?: string;
  level?: number;
  lead?: string;
  discount?: string;
  showAddress?: string;
  address?: {
          county: string,
          hood: string,
          street1: string,
          street2: string,
          city: string,
          state: string,
          zip: string,
      },
  instant?: string;
  taxNum?: string;
  system?: number;
  priv?: boolean;
  proof?: object;
  zips?: string[];
  invoice?:number;
  access?: any;

}



