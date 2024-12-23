import { BlockDTO } from "./search";
import { CalData, Deposit } from "./space";
import { GroupDTO } from "./user";

export class box{
  dimenx1!: number;
  dimenx2!: number;
  dimeny1!: number;
  dimeny2!: number;
}
export interface AvailabilityListDTO {
  av?:number[];
  avail?:AvailDTO[];
  bk?:string | string[] | undefined;
  clear?:boolean | false,
  date?:string | undefined;
  divisor?:number;
  err?:false | null;
  id?:string | undefined;
  price?:number;
  pricing?: PricingDTO[];
  selectedItems?:boolean | null;
}

export interface AvailDTO{
  access?:boolean;
  avail?:number;
  isSelected?:boolean;
  isSelecting?:boolean;
  lead?:boolean;
  level?:number;
  time?:number;
}

export interface PricingDTO{
  access?:boolean;
  available?:boolean;
  buffer?:[];
  checked?:boolean;
  endTime?:number;
  isDisabled?:boolean;
  level?:number;
  name?:string;
  price?:number;
  startTime?:number;
  table?:TableDTO[];
  _id?:string | undefined;
}
export interface TableDTO{
  amount?:number;
  days?:[];
  holiday?:boolean;
}
export interface AddonsDTO{
  _id?:string;
  name?:string;
  price?:number;
  include?:boolean;
  selected?:boolean;
  duration:any;
  blocks:any;
  selectLength?:number;
  quantity:number | undefined;
  use?:string | undefined;
  perItem?:number;
  basis?:string;
  enabled?:boolean;
  subtotal:any;
  displayPrice?:string;
  description?:string;

}
export interface Addon {
  name?: string;
  selected?: boolean;
  include?: boolean;
  displayPrice?: string;
  quantity?: number;
  description:string;
}
export interface SupervisorDTO {
  affiliation?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phon?: string;
  title?: string;
  myInfo?: boolean;
  otherAffiliation?: string;
}

export interface PaymentMethodDTO {
  token: string,
  billingDetails: {
    firstName: string,
    lastName: string,
    address: {
    line1: string,
    line2: string,
    city: string,
    state: string,
    postalCode: string
    }
  }
  customerId: string,
  email: string,
}

export interface PaymentMethodList {
  amount: number | null;
  invoice: number | null;
  offline: boolean;
  billingAddress: {
    firstName: string,
    lastName: string,
    cardholderName: string,
    cardType: string,
    last4: string,
    expirationDate: string,
    expirationMonth: number,
    expirationYear: number,
    card_id: string
  },
  cardType: string,
  last4: string,
  expirationDate: string,
  cardholderName: string,
  expirationMonth: number,
  expirationYear: number,
  firstName: string,
  lastName: string,
  imageUrl: string,
  card_id: string
}
export interface BookingDoneDTO {
  info ?: {
    s?: {
      id?: string,
      name?: string
    },
    f?: {
      id?: string,
      name?: string,
      tags?: []
    },
    o?: {
      id?: string,
      name?: string
    }
  },
  cid?: string,
  eventName?: string,
  sport?: string,
  typ?: number,
  details?: string,
  uid?: string,
  divisor?: number,
  blocks?: BlockDTO[],
  isCart?: boolean,
  buffer?: string[],
  supervisor?: SupervisorDTO,
  insurance?: boolean,
  eventDate?: string,
  cost?: {
    count?: number,
    rate?: number,
    taxRate?: number,
    txRate?: number,
    rateHours?: {
      base?: number,
      total?: number
    },
    discount?: {
      percentage?: number,
      amount?: number,
      group?: {
        name?: string
      }
    },
    optionsTotal?: number,
    options?: number[],
    subtotal?: number,
    fees?: {
      tax?: number,
      book?: number,
      insurance?: number,
      tx?: number
    },
    total?: number,
    credits?: object[]
  },
  status?: number,
  approve?: string[],
  transaction?: object[],
  internal?: number,
  attendance?: number,
  deposits?: Deposit[],
  messages?: string[],
  children?: CalData[],
  photos?: string[],
  pricing?: PricingDTO[],
  groups?: GroupDTO[],
  IsRefundable?: boolean,
  IsStripe?: boolean,
  _id?: string,
  dateC?: string,
  startTime?: number,
  endTime?: number,
  __v?: number

}
