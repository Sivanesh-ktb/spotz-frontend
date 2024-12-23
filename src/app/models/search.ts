import { AddonsDTO, PricingDTO } from "./booking";
import { OrgDetails } from "./org";

export interface nearbyCity{
  distance: number;
  name: string;
}

export interface AddressDTO {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  nearbyCity?: nearbyCity[];
  geocode: GeocodeDTO;
}

export interface GeocodeDTO {
  type: string;
  coordinates: number[];
}

export interface OrgDTO {
  id: string;
  name: string;
  shortName?: string;
  claimed?: boolean;
  banner?: string;
  gdUrl? : string
}

export interface SpacePricingDTO {
  typ: number;
  high: number;
  low: number;
}

export interface Block {
  opening: number;
  isDisabled: boolean;
  isSelected: boolean;
  isSelecting: boolean;
  conflict: number;
  name: string;
  price?: number;
  startTime?: Date;
  endTime?: Date;
  access? : boolean;
  level?: number;
  lead?: boolean;
  available?:boolean;
  avail: number;
}

export interface SpaceDTO {
  id: string;
  name: string;
  base?: string | null;
  number?: number | null;
  letter?: string | null;
  price?: number;
  stype?: number[];
  options?: string[];
  ageGroup?: string | null;
  sports?: string[];
  av?: AvailabilityDTO[];
  divisor?: number;
  pricing?: Block [] | null;
  unavail?:boolean;
  score?: ScoreDTO[];
  capacity?: number;
  org?: OrgDetails;
  fac? : FacilityDTO;
  _id?: string;
  rentaltypes?: number;
  IsRefundable: boolean;
  typ?:number[];
  addons?: AddonsDTO[] | [];
  info?: Info,
  instantBooking?: boolean;
}

export interface ScoreDTO{
  time?: number;
  opening?: number;
  conflict?: number;
  price?: number;
  val?: number;
  level?: number;
  isSelecting?: boolean;
  isSelected?: boolean;
  divisor?: number;
}

export interface AvailabilityDTO {
  id?: string;
  _id?: string;
  date?: string;
  av?: number[];
  avail?: AvailabilityItemDTO[];
  unavail?: boolean;
  valid?: boolean;
  price?: number;
  divisor?: number;
  bk?: string[];
  pricing?: any;
  score?: boolean;
  currentPage?: number;
  eventDate?: Date;
  spaces?: SpaceDTO[];
}

export interface AvailabilityItemDTO {
  time: number;
  avail: number;
  level: number;
  isSelected?: boolean;
  isSelecting?: boolean;
  status: number;
  lead?: boolean;
  access?: boolean;
  hoverBook?: boolean;
  hashKey?: string;
}

export interface Facility{
  tags?: string[],
  gdUrl?: string;
  name: string;
  id: string;
}
export interface Info{
  s: SpaceDTO,
  f: Facility,
  o: OrgDTO
}

export interface Image{
    url: string;
    dirty: number;
}

export interface Asset{
    name: string;
    url: string;
    contentType: string;
    _id:string;
}

export interface FacilityDTO {
  _id: string;
  name: string;
  address: AddressDTO;
  indoor: number;
  org: OrgDTO;
  amenity: string[];
  gdUrl: string;
  banner?: string;
  spacePricing?: SpacePricingDTO[];
  price?: number | null;
  addons?: string[];
  spaceCounts?: Record<string, number> | null;
  sports?: (string | null)[];
  related?: boolean;
  stype?: number[];
  spaces?: SpaceDTO[];
  info?: Info;
  image?: Image;
  capacity?: number;
  description: string;
  fid?: string | null | undefined;
  assets?: Asset[];
}
export interface Image {
  url: string;
}

export interface Params{
  searchDate: string;
  spa: string;
}

export class OrgFeaturedSpaceDetailsDto {
  limit!: number;
  offset!: number;
}

export interface searchDTO{
  id: string;
  base?: string | null;
  number?: number | null;
  letter?: string | null;
  stype?: number[];
  options?: string[];
  ageGroup?: string | null;
  av?: AvailabilityDTO[];
  divisor?: number;
  pricing?: string | null;
  capacity: number;
  assets: Asset[];
  facilityData: FacilityDTO;
  related?: boolean;
  info?: Info;
  image?: Image;
  fid?: string | null | undefined;
  spaces?: SpaceDTO[];
  _id: string;
  name: string;
  address: AddressDTO;
  indoor: number;
  org: OrgDTO;
  amenity: string[];
  gdUrl: string;
  banner?: string;
  spacePricing?: SpacePricingDTO[];
  price?: number | null;
  addons?: string[];
  spaceCounts?: Record<string, number> | null;
  sports?: (string | null)[];
  description: string;
}

export interface BookingSpaceDTO{
  addons: AddonsDTO[];
  typ(typ: any, arg1: (t: any) => boolean): unknown;
  center: string;
  data:DataDTO[];
  rentaltypes: number;
  pricing: PricingDTO;
  price: number;
  name: string;
  id: string;
}
export interface DataDTO{
    addons: string[];
    address: AddressDTO;
    amenities: string[];
    assets: Asset[];
    capacity: number;
    image: Image;
    info: Info;
    name: string;
    price: number;
    related: boolean;
    rentaltypes: number;
    spaces: SpaceDTO[];
    sports: string[];
    stype: number[];
    expanded: string;
    nearby: string;
}
export interface BlockDTO{
  avail?:number;
  isSelected?:boolean;
  isSelecting?:boolean;
  level?:number;
  time?:number;
  lead?:boolean;
  access?:boolean;
  score?:boolean;
  name?:string;
  table?:[];
  av:AvailabilityItemDTO[];
}



