import { PricingDTO } from "../utils/cart";
import { AddressDTO} from "./search";
import { CalData, Deposit } from "./space";
import { GroupDTO } from "./user";

export interface OrgDetails {
  salesTax: number;
  spotzFees: boolean;
  terms: TermsDTO;
  userFees: boolean;
  active?: string;
  claimed?: boolean;
  deleted?: boolean;
  featured?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  guest?: string;
  name?: string;
  sendMail?: boolean;
  host?: boolean;
  shortName?: string;
  showBookingDetails?: boolean;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  group?: number;
  nonGroup?: number;
  userId?: string;
  _id?: string;
  tx?: number;
  user?: number;
  cat?: string;
  url?: string;
  monthly?: number;
  paying?: number;
  leadTime?: number;
  legal?: {
    taxId?: string;
    typ?: string;
    name?: string;
    last4?: string;
    other?: string;
  },
  contacts: [
    {
      firstName: string,
      lastName: string,
      email: string,
      title: string,
      typ: string,
      description: string,
      phones: [{
        num: number,
        typ: string
      }]
    }
  ],
  address?: AddressDTO
}

export interface OrgId {
  orgId: string;
}

export interface orgUserDetails {
  active?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phon?: string;
  role?: string;
  _id?: string;
  orgId?: string;
  groups?: string;
  address?: Address;
  assets?: Assets;
  dob: Date;
  bio:string;
  facebook?: {
    id: string;
  };
  google?:{
    id: string;
  }
}

export interface Address {
  street1?: string;
  city?: string;
  state?: string;
  zip?: string;
}
export interface Assets {
  name?: string;
  url?: string;
  type?: string;
}
export interface addContact {

  firstName: string,
  lastName: string,
  email: string,
  title: string,
  typ: string,
  phones: [{
    num: string,
    typ: string
  }],
  isEditing: boolean
}
export interface legal {
  taxId?: string;
  typ?: string;
  name?: string;
  last4?: string;
  other?: string;
}
export interface organizationRules {
  name?: string;
  description?: string;
  url?: string;
  contentType?: string;
  byteCount?: number;
  terms?: boolean;
  _id?: string;
}
export interface imageUrl {
  url?: string;
}
export interface ImagesArray {
  images: string[];
}
export interface TermsDTO {
  host: {
    group: number,
    nonGroup: number
  },
  user: number,
  tx: number
}
export interface InvoiceDTO{
  group: [],
  nonGroup: [],
}

export interface SpaceType {
  name: string;
  value: string;
}

export interface SpaceDetailsDTO {
  organizationId: string;
  name: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    geocode: {
      type: string;
      coordinates: number[];
    };
    country: string;
    nearbyCity: string[];
  };
  spaceTypes: SpaceType[];
  host: string;
}



export interface OrcfileDTO {
  name?: string;
  description?: string;
}

export interface EmbedOptions {
  color: boolean;
  bgcolor: string;
  button: boolean;
  btncolor: string;
  display: string;
  code: string;
  url: string;
  height: number;
}

export interface ViewModel {
  embed: EmbedOptions;
}

export interface Account {
  last4: string;
  account: string;
  routing: string;
  _id: string;
}

export interface BookingInboxDTO{
  info: {
     s: {
       id: string;
       name: string;
     },
     f: {
       id: string;
       name: string;
       tags: string[];
     },
     o: {
       id: string;
       name: string;
     }
   },
   _id: string;
   cid: string;
   eventName: string;
   sport: string;
   typ: number;
   details: string;
   uid: string;
   divisor: number;
   endDate: string;
   blocks: number[];
   isCart: boolean;
   buffer: string[];
   dismissed: boolean;
   eventTab: boolean;
   upcoming: number;
   invoice:string;
   supervisor: {
     firstName: string;
     lastName: string;
     phon: string;
     email: string;
   },
   insurance: boolean;
   eventDate: string;
   cost: {
     rateHours: {
       base: number;
       total: number;
     },
     discount: {
       group: {
         name: string;
       },
       percentage: number;
       amount: number;
     },
     fees: {
       tax: number;
       book: number;
       insurance: number;
       tx: number;
     },
     count: number;
     rate: number;
     taxRate: number;
     txRate: number;
     optionsTotal: number;
     options: string[];
     subtotal: number;
     total: number;
     credits: string[];
   },
   status: number;
   approve: string[];
   transaction: [
     {
       creditCard: {
         cardType: string;
         last4: string;
         cardholderName: string;
       },
       authCode: string;
       dateC: string;
       success: boolean;
       items: string[];
     }
   ],
   internal: number;
   attendance: number;
   deposits: Deposit[];
   messages: string[];
   children: CalData[];
   photos: PhotosDTO[];
   pricing: PricingDTO[];
   groups: GroupDTO[];
   showChildren: boolean;
   IsRefundable: boolean;
   IsStripe: boolean;
   dateC: string;
   startTime: number;
   endTime: number;
   __v: number;

 }
export interface PhotosDTO {
  url: string;
  description: string;
  _id: string;
}
export interface SpacePricingDTO {
  isSelected: boolean;
  price: number;
  name: string;
  startTime: number;
  endTime: number;
}
export interface ReservationDTO{
  success: boolean;
  title: string;
  reservation :{
    info: {
      s: {
        id: string;
        name: string;
      },
      f: {
        id: string;
        name: string;
        tags: string[];
      },
      o: {
        id: {
          region: {
            id: string;
            urlName: string;
          },
          rental: {
            min: number;
          },
          terms: {
            host: {
              nonGroup: number;
              group: number;
            },
            tx: number;
            user: number;
          },
          leadTime: number;
          timeBlock: number;
          paying: number;
          guest: number;
          monthly: number;
          showBookingDetails: boolean;
          sendMail: boolean;
          userFees: boolean;
          spotzFees: boolean;
          _id: string;
          dateM: string;
          shortName: string;
          name: string;
          url: string;
          address: {
            geocode: {
              coordinates: number[];
              type: string;
            },
            county: string;
            hood: string;
            street1: string;
            city: string;
            state: string;
            zip: string;
            nearbyCity: string[];
          },
          claimed: boolean;
          featured: number;
          active: number;
          tags: string[];
          accts: string[];
          files: string[];
          groups: string[];
          pricing: SpacePricingDTO[];
          facilities: [
            {
              tags: string[];
              id: string;
              name: string;
              shortName: string;
            }
          ],
          noprofit: boolean;
          host: boolean;
          notify: string[];
          deleted: boolean;
          phones: string[];
          contacts: [
            {
              firstName: string;
              lastName: string;
              title: string;
              typ: string;
              phones: [
                {
                  num: string;
                  typ: string;
                }
              ];
            }
          ];
          __v: number;
          gdUrl: string;
          logo: string;
          banner: string;
          description: string;
          spaces: [
            {
              indoor: {
                count: number;
                avg: number;
                max: number;
                min: number;
              },
              outdoor: {
                count: number;
              },
              typ: number;
            }
          ],
          deposits: string[];
          templates: string[];
        },
        name: string;
      }
    },
    _id: string;
    cid: string;
    eventName: string;
    sport: string;
    typ: number;
    details: string;
    uid: string;
    divisor: number;
    blocks: number[];
    isCart: boolean;
    buffer: string[];
    supervisor: {
      firstName: string;
      lastName: string;
      phon: string;
      email: string;
    },
    insurance: boolean;
    eventDate: string;
    cost: {
      rateHours: {
        base: number;
        total: number;
      },
      discount: {
        group: {
          name: string;
        },
        percentage: number;
        amount: number;
      },
      fees: {
        tax: number;
        book: number;
        insurance: number;
        tx: number;
      },
      count: number;
      rate: number;
      taxRate: number;
      txRate: number;
      optionsTotal: number;
      options: string[];
      subtotal: number;
      total: number;
      credits: string[];
    },
    status: number;
    approve: string[];
    transaction: string[];
    internal: number;
    attendance: number;
    deposits: string[];
    messages: string[];
    children: string[];
    photos: string[];
    pricing: string[];
    groups: string[];
    IsRefundable: boolean;
    IsStripe: boolean;
    dateC: string;
    startTime: number;
    endTime: number;
    __v: number;
  }
}


