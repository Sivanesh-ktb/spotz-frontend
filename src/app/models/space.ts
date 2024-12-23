import { BookingDTO } from "../utils/cart";
import { AddressDTO, AvailabilityDTO, FacilityDTO } from "./search";


export interface SpaceData{
  _id?: string;
  name?: string;
  price?: string;
  m?: string;
  v?: number;
  l?: number;
  w?: number;
  base?: string;
  number?: number;
  suffix?: string;
  ageGroup?: string;
  surface?: string;
  indoor?: number;
  tagline?: string;
  summary?: string;
  letter?: string;
  rentaltypes?: boolean;
  IsRefundable?: boolean;
  childId?: string[];
  nonRental?: number;
  hourly?: boolean;
  pricing?:[
    {
      name?: string,
      startTime?: number,
      endTime?: number,
      table: [{
        holiday?: boolean,
        amount?: number,
        days: []
      }],
      checked?: boolean,
      available?: boolean,
      additional?: boolean,
      buffer: [{
        startTime?: number,
        endTime?: number
      }],
      errors: []
    }
  ];
  deposits:[
    {
      name?: string;
      text?: string;
      amount?: number;
      active?: boolean;
    }
  ];
  assets?: string[];
  notify?: boolean;
  eventName?: boolean;
  sports?: string[];
  typ?: number[];
  capacity?: number;
  addons: [
    {
    name?: string;
    price?: string;
    type?: string;
    basis?: string;
    category?: string;
    description?: string;
    selectLength?: number;
    include?: boolean;
    perItem?: boolean;
    inactive?: boolean;
    quantity?: number;
    enabled?: boolean;
    typ?: number[];
  }];
  amenity?: string[];
  rental: {
    buffer: [
      {
        before?: number,
        after?: number
      }
    ],
    block?: number
  };
  instantBooking?: boolean;
  Capacity?: number;
  parentId?: string;
}
export interface spaceList {
  id: string;
  name: string;
  nonRental: number;
}
export interface AddOn {
  name?: string;
  price?: number;
  type?: string;
  basis?: string;
  category?: string;
  description?: string;
  selectLength?: number;
  include?: boolean;
  perItem?: boolean;
  enabled?: boolean;
  inactive?: number;
  quantity?: number;
  typ?: number[];
  showEdit?: boolean;
}

export interface Deposit{
  _id?: any;
  name: string;
  text: string;
  amount: number;
  active: boolean;
}
export interface SpaceType {
  name: string;
  value: number;
  home: boolean;
  sort: number;
}
export interface address{
  city?: string;
  state?: string;
  zip?: string;
  country?: string;

}
export interface BlockData {
  access: number;
  active: number;
  allDay: boolean;
  attendance: any;
  days: string[];
  description: string;
  divisor: number;
  endDate: string;
  endTime: number;
  info: {
    id: string;
  };
  internal: number;
  isPublic: boolean;
  options: any[];
  pricing: any[];
  reason: any;
  registration: {
    link: string;
    capacity: number | null;
    description: string;
  };
  ruleset: {
    description: string;
    rules: any;
  };
  skips: any[];
  sport: string;
  startDate: string;
  startTime: number;
  type: number;
  uid: string;
  __v: number;
  _id: string;
}

export interface Rule {
  facilityOptions: {
    type: number;
    tags: any[];
    facilities: any[];
  };
  name: string;
  spaceOptions: {
    type: number;
    spaceTypes: any[];
    spaces: any[];
  };
  _id: string;
}
export interface Pagination{
first: number;
page: number;
pageCount: number;
rows: number;
}

export interface Dimension {
  o?: {
      m: string;
      v: number;
  };
  a?: {
      m: string;
      v: number;
  };
  l?: {
      m?: string;
      v: number; 
  };
  w?: {
      m?: string;
      v: number;
  };
}

export interface PricingTable {
  amount: number;
  days: string[];
  holiday: boolean;
}

export interface PricingBuffer {
  startTime: number;
  endTime: number;
}

export interface Pricing {
  startTime: number;
  endTime: number;
  table: PricingTable[];
  buffer: PricingBuffer[];
  name: string;
  checked: boolean;
  available: boolean;
  _id: string;
}

export interface Rental {
  buffer: object[];
  block: number;
}

export interface Social {
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface Terms {
  host: {
    group: number;
    nonGroup: number;
  };
  user: number;
  tx: number;
}

export interface Org {
  social: Social;
  terms: Terms;
  _id: string;
  name: string;
  url: string;
  shortName: string;
  address: AddressDTO;
  gdUrl: string;
  leadTime: number;
  claimed: boolean;
  contacts: [];
  facilities: FacilityDTO[];
  deposits: [];
  files: [];
  logo: string;
  spotzFees: boolean;
  userFees: boolean;
  groups: Group[];
}

export interface Group {
  access: {
    limited: number;
    facs: [];
    spaceTypes: [];
  };
  _id: string;
  system: number;
  name: string;
  level: number;
  discount: number;
  lead: number;
  taxNum: string | null;
  instant: boolean;
  description: string;
  zips: [];
  priv: number;
  invoice: number;
  proof: Proof[];
  facs: [];
  bal: number;
  address: AddressDTO;
  members: [];
  org: string;
  __v: number;
}

export interface Proof {
  require: number;
  typ: number;
  instructions: string;
}

export interface AddOnDTO{
    selected: boolean;
    enabled?: boolean;
    name?: string;
    quantity?: number;
    price?: number;
    basis?: string;
    category?: string;
    typ?: number[];
    description?: string;
    inactive?: number;
    perItem?: boolean;
    include?: boolean;
    selectLength?: boolean;
    _id: string;
    indoor: string | null;
    use?: any;
    subtotal?: number;
    duration?: string;
}

export interface SpaceDTO {
  _id?: string; 
  dateM?: string;
  org?: string | Org;
  price?: number;
  dimension?: Dimension;
  name?: string;
  base?: string;
  number?: number;
  letter?: string;
  suffix?: string;
  _v?: number;
  rentaltypes?: number;
  IsRefundable?: boolean; 
  childId?: string[]; 
  nonRental?: number;
  hourly?: boolean;
  pricing?:  Pricing[];
  deposits?: Deposit[];
  assets?: [];
  notify?: boolean;
  eventName?: boolean | null; 
  rental?: Rental;
  instantBooking?: boolean;
  facility?: {
    fid: string;
  };
  sports?: string[];
  typ?: number[]; 
  capacity?: number;
  addons?: AddOnDTO[];
  amenities?: string[];
  surface?: string | null;
  indoor?: number | null;
  tagline?: string | null;
  summary?: string | null;
  ageGroup?: string | null;
  amenity?: string[];
  fac?: FacilityDTO;
  image?: { url: string };
}
export interface Filter {
  repeat: {
    active: boolean;
    rules: {
      type: number;
      date:{
        selected: number;
      };
      day: { checked: boolean }[];
      end: {
        rule: number;
        data: [
          number,
          Date | null | string | undefined
        ];
      };
      dayString: () => void;
    };
  };
}
export interface RecurringFilterParams {
  searchDate?: number | Date | null | string;
  spa?: string;
  daily?: number;
  end?: number | Date | null | string | undefined;
  weekly?: string;
  monthly?: number;
}


export interface Event {
  title: string;
  start: string;
  end: string;
  id: string,
  resourceId: string,
  className: string[],
  calId: string,
  startBlock: number,
  endBlock: number,
  color: string,
  textColor: string,
  rendering: string
}

export interface CalData{
    fid: string | null; 
    sid: string | null;
    public: boolean;
    events: Event[];
    map: Map<string, Event[]>;
    resources: any[];
    nextDate: string | null;
    spaces : SpaceData;
    calendars: AvailabilityDTO[];
    bookings: BookingDTO[];
}