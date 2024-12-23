import { FormGroup } from "@angular/forms";
import { facilityList } from "./facility";
import { SpaceType } from "./space";

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    hood?: string;
    county?: string;

  };
  dob?: string;
  gender?: string;
  title?: string;
  subaccountid?: string;
  isstripepayment?: boolean;
  assets?:[
    {
      name?: string;
      url?: string;
      contentType?: string;
      current?: boolean;
    }
  ];
  affiliation?: [];
  isPasswordSet?: boolean;
  reviews?: [];
  links?: [];
  groups?: [];
  insurances?: [];
  lang?: [];
  tzone?: string;
  geocode?: {
    coordinates?:[];
    type?: string;
  };
  notifications?: {
    updates?: {
      email: boolean
    },
    reminder?: {
      email: boolean
    }
},
  bio?: string;


}
export interface Data {
  uid?: string;
  orgId?: string;
  groupId?: string;
  visible?: boolean;
  groupDetails?: any;
  limited?: boolean;
  facilitiesTab?: boolean;
  accessType?: number;
  active?: number;
  approve?: number;
  spaceTypes?: SpaceType[];
  facilities?: facilityList[];
  spaceForm?: FormGroup;
  facilityForm?: FormGroup;
}
export interface UserSignup {
  showSignup: boolean;
}



export interface GroupDTO {
  discountError?: string;
  _id?: string;
  org?: string;
  name?: string;
  level?: number;
  discount?: number;
  lead?: number;
  instant?: boolean;
  system?: 0 | 1;
  taxNum?: 0 | 1;
  upToDate?: boolean;
  admin?: boolean;
  approver?: boolean;
  access?:any;
  id?: string;
  invoice?: boolean;
  leadTime?: number;
  taxExempt?: boolean;
  info?: {
    _id: string;
    name: string;
  } | null;
}