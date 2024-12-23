export interface OperatingHours {
  days?: string[];
  start?: string;
  end?: string;
}

export interface FacilityData{
  name?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  description?: string;
  abbr?: string;
  amenities?: string[];
  href?: string;
  showAvailability?:boolean;
  hours?: OperatingHours[];
  spacePricing?: string;
  spaceGroups?: string;
  shortName?: string;
  claimed?: boolean;
  indoor?: number;
  outdoor?: number;
  indoorOutdoor?: number;
  extra?:[],
  message?: string;
}
export interface facilityId{
  facilityId: string;
}
export interface facilityList{
  id : string;
  name : string;
  shortName : string;
}
export interface timeBlock
{
  startTime?: string;
  endTime?: string;
  selectedDays?: string[];
}
export interface iconData
{
  id?: number;
  coordinates?:[number,number];
  type?: string;
  name?: string;
}
export interface markerData {
  id: number;
  position: {
    lat: number;
    lng: number;
  };
  type: string;
  name: string;

}
export interface facilityData{
  description:string;
  typ:string;
  name?: string;
  place_id: string;
  city?: string;
  o?: string;
  oid?: string;
  data:[
    number,
    number
  ];
}

export interface facTimeBlock
{
  start?: string;
  end?: string;
  days?: string[];
}

export interface FacilityResponseDTO{
  status?: number;
  body?: FacilityData;
  message?: string;
}



