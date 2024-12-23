
import { Injectable } from '@angular/core';

@Injectable({
  providedIn : 'root'
})

export class AppConst{
  public readonly adminRole:string;
  public readonly approverRole : string;
  public readonly editorRole : string;
  public readonly maintenanceManagerRole : string;
  public readonly maintenanceStaffRole : string;
  public readonly inviteAdminRole : string;
  public readonly inviteApproverRole : string;
  public readonly inviteEditorRole : string;
  public readonly startPage = 1;
  public readonly pageSize = 6;
  public readonly startedYear = 2018;
  public readonly INDOOR = 0;
  public readonly OUTDOOR = 1;
  public readonly ADMIN ="Admin";
  public readonly APPROVER ="Approver";
  public readonly LOGIN_TAB = 1;
  public readonly SIGNUP_TAB = 2;
  public readonly RESET_TAB = 3;
  public readonly FORGET_PASSWORD_TAB = 4;
  public readonly MESSAGE_TAB =2;
  public readonly PAYMENT_TAB =1;
  public readonly TRANSACTION_TAB =1;
  public readonly CART_DETAILS =1;
  public readonly MAX_PAGE_SIZE =2;
  public readonly RESET_PASSWORD_SUCCESS_MESSAGE="Password reset successfully";
  public readonly EDITOR ="Editor";
  public readonly MAINTENANCE_MANAGER ="Maintenance Manager";
  public readonly MAINTENANCE_STAFF ="Maintenance Staff";
  public readonly SYSTEM_GROUP_STATUS = 1;
  public readonly CUSTOM_GROUP_STATUS = 0;
  public readonly RENTAL_BLOCK_SIXTY_MINUTES = 60;
  public readonly RENTAL_BLOCK_THIRTY_MINUTES = 30;
  public readonly RENTAL_BLOCK_FIFTEEN_MINUTES = 15;
  public readonly RENTAL_BLOCK_SIXTY = 1;
  public readonly RENTAL_BLOCK_THIRTY = 2;
  public readonly RENTAL_BLOCK_FIFTEEN = 4;
  public readonly BOOKING_STATUS_APPROVED = 'Approved';
  public readonly BOOKING_STATUS_DENIED = 'Denied';
  public readonly PERIOD = ['AM', 'PM'];
  public readonly selectDropDownMonth = ['December', 'November', 'October', 'September', 'August', 'July',
    'June', 'May', 'April', 'March', 'February', 'January'];
  public readonly orgSearch = "org";
  public readonly facSearch = "fac";
  public readonly locSearch = "loc";
  public readonly searchStartTime='24:00';
  public readonly searchEndTime='04:00';
  public readonly searchProximity = 25;
  public readonly defaultColor="#747474";
  public readonly mapZoom = 9;
  public readonly bookingInfo =0;
  public readonly bookingSchedule =1;
  public readonly bookingUsageDetails =2;
  public readonly bookPage =3;
  public readonly bookingOption =4;
  public readonly bookingPayment =5;
  public readonly bookingVerify =6;
  public readonly bookingDone =7;
  public readonly ZOOM_DEFAULT =4;
  public readonly MAP_ZOOM= 14;
  public readonly bannerLoader =1;
  public readonly profileLoader =2;
  public readonly dayFilterType=0;
  public readonly weekFilterType=1;
  public readonly monthFilterType=2;
  public readonly defaultMonth=6;
  public readonly startTime='00:00';
  public readonly dateString='YYYY-MM-DD';
  public readonly calendarHeaderToolBar="timeGridDay,timeGridThreeDay,timeGridWeek,dayGridMonth";
  public readonly addonPriceBases = ['per use', 'per hour'];
  public readonly searchWeekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  public readonly multiSelect = "Multiple - mixed";
  public readonly spaceListingMetaTitle ="Spotz : Listing & Booking Spaces";
  public readonly updateMapLocation ="Update all the markers on the map?";
  public readonly clearMapLocation = "This will clear all the markers on the map";
  public readonly adminRoleTitle : string = "Admin Members";
  public readonly approverRoleTitle : string = "Approver Members";
  public readonly editorRoleTitle : string = "Editor Members";
  public readonly maintenanceManagerRoleTitle : string = "Maintenance Manager Members";
  public readonly removeGroupTitle ="REMOVE GROUP";
  public readonly removeGroupContentOne = "Are you sure you want to delete the group and revoke access to all its members";
  public readonly removeGroupContentTwo = "Group name: ";
  public readonly removeMemberTitle = "ARE YOU SURE?";
  public readonly removeMemberContentOne = "Remove membership?";
  public readonly removeUser = " DELETE USER?";
  public readonly removeUserContent ="will be permanently removed from group";
  public readonly maintenanceStaffRoleTitle : string = "Maintenance Staff Members";
  public readonly commonRoleOne :string = "You can invite existing Spotz users to be members of the group or invite new Spotz users, too.";
  public readonly commonRoleTwo : string = "Enter an email in the box and click 'Invite'. If they are a current user, they will be automatically added to the group and sent a notification. If they are not a current user, we'll invite them to Spotz and then they can accept the membership."
  public readonly usState : string[];
  public readonly facilityType : string[] = ['Indoor','Outdoor','Indoor/Outdoor'];
  public readonly rentalTypeOne : string = 'Hour';
  public readonly rentalTypeTwo: string = 'Day';
  public readonly nameInfo: string = 'Must use your real name';
  public readonly defaultButtonColor:string = "#e58327";
  public readonly defaultTextColor:string = "#fff";

  public readonly affiliationInfo : string ='Help administrators identify you.';
  public readonly profileDescriptionInfo : string ='Use this space to complete your profile and let people get to know you!';
  public readonly profileAddressInfo : string = 'Your address, including city and postal code maybe required for discounts at some athletic spaces.';
  public readonly spaceNumberInfo : string = '(optional) Space Numbers help sort your space in a list.';
  public readonly spaceLetterInfo : string = '(optional) Add a letter (A,B,C..) or direction (N,S,E,W)';
  public readonly spaceSuffixInfo : string = "(optional) Additional descriptor (i.e. Age Group, 'Adult','U8', etc)";
  public readonly spaceTypeInfo : string = "Important: this is for a single space used in multiple types (e.g. a baseball diamond with a soccer field in the outfield)";
  public readonly spaceAreaInfo : string = "We use area as a metric for space size in a space search";
  public readonly facSpaceInfo : string = 'A space is a rentable unit. This could be a gym, a field, etc within a facility.';
  public readonly orgTagInfo : string = 'Use tags to generate views or reports for this facility.';
  public readonly orgFacilityInfo : string = 'A facility is a park or building and comprises the physical address and contact information for a rentable space.';
  public readonly weekDays : string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  public readonly weekEnds : string[] = ['Saturday', 'Sunday'];

  public readonly organization_parent_text: string =  'Are you sure you would like to remove the organization';
  public readonly organization_child_text : string =  'Removing the space will delete all inventory, facilities and spaces.';

  public readonly facility_parent_text: string =  'Are you sure you would like to remove the facility';
  public readonly facility_child_text : string =  'Removing the facility will delete all inventory, all spaces and remove the facility from'

  public readonly spaces_parent_text: string =  'Are you sure you would like to remove the space';
  public readonly spaces_child_text : string =  'Removing the space will delete all inventory and remove the space from'

  public readonly organization_Heading: string =  'REMOVE ORGANIZATION';
  public readonly facility_Heading : string =  'REMOVE FACILITY'
  public readonly spaces_Heading: string =  'REMOVE SPACE';
  public readonly New_Template_Name ='<TEMPLATE NAME>';
  public readonly google_map_url='https://www.google.com/maps?q=';
  public readonly logo_url = 'https://6907127.fs1.hubspotusercontent-na1.net/hub/6907127/hubfs/Logo/Spotz%20Logo%20-%20Full%20Color-01.png?height=120&name=Spotz%20Logo%20-%20Full%20Color-01.png';
  public readonly support_link = 'https://support.findspotz.com/knowledge';
  public readonly days: { name: string, shortName: string }[] =  [
                                          { name: 'Monday', shortName: 'M' },
                                          { name: 'Tuesday', shortName: 'T' },
                                          { name: 'Wednesday', shortName: 'W' },
                                          { name: 'Thursday', shortName: 'Th' },
                                          { name: 'Friday', shortName: 'F' },
                                          { name: 'Saturday', shortName: 'S' },
                                          { name: 'Sunday', shortName: 'S' }
                                        ];
public readonly region_first_text: string = 'Regions are really only used to define a search, in the instance that we do not have any data.'
public readonly region_second_text: string = 'For instance, if I was searching for an Indoor Court in Bozeman, MT I would get zero results, even with a large search radius. We then return the closest areas to find space in the system. In this case, we should make sure Mizzoula, MT is in the regions database until we have better coverage in order to provide the best user experience.'

public readonly spotz_instagram_link : string = 'https://www.instagram.com/find.spotz/';
public readonly spotz_facebook_link : string = 'https://www.facebook.com/findspotz';
public readonly spotz_twitter_link : string = 'https://twitter.com/findspotz';
public readonly spotz_linkedIn_link : string = 'https://www.linkedin.com/company/findspotz/';

public readonly spotz_signup_link : string = 'https://go.findspotz.com/signup';
public readonly pricingInfo='This amount can be changed when applied to a space';
public readonly taxTypes = [
  'Individual', 'C Corp', 'S Corp', 'Partnership', 'LLC', '501(c)3', 'Other'
];

  public readonly allDays : string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public readonly months : string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public readonly AGE_GROUPS = [
    { name: 'Adult - Full Size',        type: 'All',                  sort: 0     },
    { name: '4',                        type: 'All',                  sort: 0     },
    { name: '6',                        type: 'All',                  sort: 0     },
    { name: '8',                        type: 'All' ,                  sort: 0   },
    { name: '10',                       type: 'All' ,                  sort: 0    },
    { name: '12',                       type: 'All' ,                  sort: 0     },
    { name: '14',                       type: 'All'  ,                  sort: 0    },
    { name: '16',                       type: 'All',                  sort: 0      },
    { name: 'U-6',                      type: 'Soccer / Fútbol',      sort: 2     },
    { name: 'U-7',                      type: 'Soccer / Fútbol' ,      sort: 2   },
    { name: 'U-8',                      type: 'Soccer / Fútbol' ,      sort: 2   },
    { name: 'U-9',                      type: 'Soccer / Fútbol' ,      sort: 2   },
    { name: 'U-10',                     type: 'Soccer / Fútbol',      sort: 2     },
    { name: 'U-11',                     type: 'Soccer / Fútbol' ,      sort: 2    },
    { name: 'U-12',                     type: 'Soccer / Fútbol',      sort: 2     },
    { name: 'U-13',                     type: 'Soccer / Fútbol',      sort: 2     },
    { name: 'U-14',                     type: 'Soccer / Fútbol' ,      sort: 2    },
    { name: 'U-15',                     type: 'Soccer / Fútbol',      sort: 2    },
    { name: 'U-16',                     type: 'Soccer / Fútbol' ,      sort: 2    },
    { name: 'U-17',                     type: 'Soccer / Fútbol',      sort: 2      },
    { name: 'Tee Ball',                 type: 'Baseball / Little League', sort: 1 },
    { name: 'Minor League',             type: 'Baseball / Little League', sort: 1   },
    { name: 'Little (Major) League',    type: 'Baseball / Little League', sort: 1   },
    { name: 'Junior League',            type: 'Baseball / Little League', sort: 1  },
    { name: 'Senior League',            type: 'Baseball / Little League' , sort: 1   },
    { name: 'Big League',               type: 'Baseball / Little League', sort: 1     }
  ];
  public readonly SPORT_ENUM = [
    {
        name: 'Badminton',
        type: 'Racquet sports',
        sort: 6
    },
    {
        name: 'Ballet',
        type: 'Dance/Tumbling/Performance',
        sort: 7
    },
    {
        name: 'Basketball',
        type: 'Court Sports',
        sort: 1
    },
    {
        name: 'Basketball',
        type: 'Popular',
        home: true,
        search: 1
    },
    {
        name: 'Baseball',
        type: 'Popular',
        sort: 0,
        home: true,
        search: 3,
    },
    {
        name: 'Baseball',
        type: 'Diamond',
        sort: 2
    },
    {
        name: 'Capoeira *',
        type: 'Martial Art/Grappling',
        sort: 8
    },
    {

        name: 'Cheerleading (youth)',
        type: 'Dance/Tumbling/Performance'
    },
    {
        name: 'Cheerleading (adult) *',
        type: 'Dance/Tumbling/Performance'
    },
    {
        name: 'Cricket',
        type: 'Field Sports',
    },
    {
        name: 'Cross-Fit',
        type: 'Training',
        sort: 5,
        home: true,
        search: 12,
    },
    {
        name: 'Dance Aerobics',
        type: 'Dance/Tumbling/Performance'
    },
    {
        name: 'Dance Other',
        type: 'Dance/Tumbling/Performance'
    },
    {
        name: 'Performance Art',
        type: 'Dance/Tumbling/Performance'
    },
    {
        name: 'Dodgeball',
        type: 'Other Team Sports',
        sort: 4
    },
    {
        name: 'Dodgeball',
        type: 'Court Sports',
    },
    {
        name: 'Field Hockey *',
        type: 'Other Team Sports'
    },
    {
        name: 'Field Hockey *',
        type: 'Field Sports',
        sort: 3
    },
    {
        name: 'Figure Skating',
        type: 'Skating'
    },
    {
        name: 'Flag Football (youth)',
        type: 'Popular',
        search: 8,
        home: false
    },
    {
        name: 'Flag Football (adult) *',
        type: 'Popular'
    },
    {
        name: 'Family Picnic/Reunion',
        type: 'Popular',
    },
    {
        name: 'Flag Football (youth)',
        type: 'Field Sports'
    },
    {
        name: 'Flag Football (adult) *',
        type: 'Field Sports'
    },
    {
        name: 'Floor Hockey *',
        type: 'Other Team Sports'
    },
    {
        name: 'Football (youth)',
        type: 'Popular',
        search: 7,
        home: true
    },
    {
        name: 'Football (adult) *',
        type: 'Popular'
    },
    {
        name: 'Football (youth)',
        type: 'Field Sports'
    },
    {
        name: 'Football (adult) *',
        type: 'Field Sports'
    },
    {
        name: 'Futsal',
        type: 'Other Team Sports',
        search: 6,
        home: false
    },
    {
        name: 'Futsal',
        type: 'Court Sports'
    },
    {
        name: 'Golf',
        type: 'Popular'
    },
    {
        name: 'Grappling Other *',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Gymnastics *',
        type: 'Dance/Tumbling/Performance'
    },
    {
        name: 'Handball',
        type: 'Other Team Sports'
    },
    {
        name: 'Handball',
        type: 'Field Sports'
    },
    {
        name: 'Ice Hockey *',
        type: 'Popular',
        search: 8,
        home: true
    },
    {
        name: 'Jiu-Jitsu *',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Judo *',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Karate *',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Kickball',
        type: 'Other Team Sports'
    },
    {
        name: 'Kickball',
        type: 'Diamond'
    },
    {
        name: 'Lacrosse (youth)',
        type: 'Popular',
        search: 9,
        home: true
    },
    {
        name: 'Lacrosse (adult) *',
        type: 'Popular'
    },
    {
        name: 'Lacrosse (youth)',
        type: 'Field Sports'
    },
    {
        name: 'Lacrosse (adult) *',
        type: 'Field Sports'
    },
    {
        name: 'Martial Arts Other *',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Open Play',
        type: 'Other Team Sports'
    },
    {
        name: 'Open Skating',
        type: 'Skating'
    },
    {
        name: 'Pickleball',
        type: 'Raquet Sports'
    },
    {
        name: 'Pilates',
        type: 'Training'
    },
    {
        name: 'Biking',
        type: 'Training'
    },
    {
        name: 'Running/Track',
        type: 'Training'
    },
    {
        name: 'Polo',
        type: 'Other Team Sports'
    },
    {
        name: 'Quidditch',
        type: 'Other Team Sports'
    },
    {
        name: 'Racquetball',
        type: 'Raquet',
        search: 12,
        home: false
    },
    {
        name: 'Rugby *',
        type: 'Other Team Sports'
    },
    {
        name: 'Rugby *',
        type: 'Field Sports'
    },
    {
        name: 'Soccer',
        search: 5,
        type: 'Popular',
        home: true
    },
    {
        name: 'Soccer',
        type: 'Field Sports'
    },
    {
        name: 'Softball',
        type: 'Popular',
        search: 4,
        home: true
    },
    {
        name: 'Softball',
        type: 'Diamond'
    },
    {
        name: 'Speed Skating',
        type: 'Skating'
    },
    {
        name: 'Squash',
        type: 'Raquet'
    },
    {
        name: 'Swimming *',
        type: 'Popular'
    },
    {
        name: 'Taekwondo *',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Tap Dance',
        type: 'Dance/Tumbling/Performance'
    },
    {
        name: 'Tennis',
        type: 'Popular',
        search: 11,
        home: true
    },
    {
        name: 'Tennis',
        type: 'Raquet Sports'
    },
    {
        name: 'Training',
        type: 'Training'
    },
    {
        name: 'Training Bootcamp',
        type: 'Training'
    },
    {
        name: 'Ultimate Frisbee',
        type: 'Popular',
        search: 10,
        home: true
    },
    {
        name: 'Ultimate Frisbee',
        type: 'Field Sports'
    },
    {
        name: 'Volleyball',
        type: 'Popular',
        search: 2,
        home: true
    },
    {
        name: 'Volleyball',
        type: 'Court Sports'
    },
    {
        name: 'Wallyball',
        type: 'Other Team Sports'
    },
    {
        name: 'Wiffleball',
        type: 'Other Team Sports'
    },
    {
        name: 'Wiffleball',
        type: 'Diamond'
    },
    {
        name: 'Wrestling (youth)',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Wrestling (adult) *',
        type: 'Martial Art/Grappling'
    },
    {
        name: 'Yoga',
        type: 'Popular',
        search: 13,
        home: true
    },
    {
        name: 'Birthday Party',
        type: 'Social'
    },
    {
        name: 'Anniversary Party',
        type: 'Social'
    },
    {
        name: 'Wedding/Bridal/Baby Shower',
        type: 'Social'
    },
    {
        name: 'Networking Event',
        type: 'Social'
    },
    {
        name: 'Family Reunion',
        type: 'Social'
    },
    {
        name: 'High School/College Reunion',
        type: 'Social'
    },
    {
        name: 'Concert',
        type: 'Performance',
    },
    {
        name: 'Dance Rehearsal/Recital',
        type: 'Performance'
    },
    {
        name: 'Music Rehearsal/Recital',
        type: 'Performance'
    },
    {
        name: 'Class/Lecture',
        type: 'Meeting'
    },
    {
        name: 'Meetup',
        type: 'Meeting'
    },
    {
        name: 'Other *',
        type: 'Other'
    }

];
  public readonly  SURFACE_ENUM=[
    'asphalt',
    'concrete',
    'carpet',
    'grass',
    'turf',
    'linoleum-vinyl',
    'rubber',
    'sand',
    'sport-court',
    'wood',
    'clay',
    'ice'
];
  public readonly facilityAmenity : string[] =['Heat','Air Conditioning','Wifi','Wheelchair Accessible','Concessions','Shelter','Restrooms','Drinking Fountain','Portable Restrooms','Off Street Parking'];
  constructor(){
    this.adminRole = " Admins oversee the entire organization and approve rentals, can make edits and updates listings & calendars."
    this.approverRole = "Approvers are solely responsible for approving and denying rental sessions.";
    this.editorRole = " Responsible for setting up calendars, including availability blocks and internal rentals.";
    this.maintenanceManagerRole = "Facility maintenance manager. Access to approved bookings and any work orders for spaces. Can create tasks, close work orders, and message renters, as needed.";
    this.maintenanceStaffRole ="Facility maintenance staff. Access to approved bookings and any work orders for spaces.";
    this.inviteAdminRole ="Admins oversee the entire organization and approve rentals, can make edits and updates listings calendars.";
    this.inviteApproverRole = " Approvers are solely responsible for approving and denying rental sessions.";
    this.inviteEditorRole = "Copy and listing editors. Responsible for setting up calendars, including availability blocks and internal rentals.";
    this.usState = [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'DC',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY'
    ];
  }

  public readonly SPACES_ENUM = [
    { name: 'Indoor Court',     value: 0,  home: true,  sort: 17,
                            },

    { name: 'Diamond',          value: 1,  home: true,  sort: 11,
                            },

    { name: 'Field',            value: 2,  home: true,  sort: 13,
                            },
    { name: 'Rink',             value: 3,  home: true,  sort: 29,
                            },
    { name: 'Studio',           value: 4,  home: true,  sort: 33,
                            },
    { name: 'Net/Raquet Court', value: 5,  home: true,  sort: 21,
                            },
    { name: 'Track',            value: 6,  home: true,  sort: 34  },
    { name: 'Cross-Train',      value: 7,  home: true,  sort: 10 },
    { name: 'Shelter',          value: 8,  home: true, sort: 31  },
    { name: 'Weight Room',      value: 9,  home: true, sort: 36 },
    { name: 'Multi-Use Room',   value: 10, home: true, sort: 20 },
    { name: 'Performing Art',   value: 11, home: true, sort: 27 },
    { name: 'Batting Cage',     value: 12, home: true,  sort: 4 },
    { name: 'Golf Simulator',   value: 16, home: true, sort: 16 },
    { name: 'Pool',             value: 13, home: true, sort: 28 },
    { name: 'Outdoor Court',    value: 14, home: true, sort: 23  },
    { name: 'Sand Court',       value: 15, home: true, sort: 30  },
    { name: 'Conference Room',       value: 17, home: true, sort: 7  },
    { name: 'Small Meeting Room',       value: 18, home: true, sort: 32  },
    { name: 'Large Meeting Room',       value: 19, home: true, sort: 18  },
    { name: 'Training Meeting Room',       value: 20, home: true, sort: 35  },
    { name: 'Atrium/Lobby',       value: 21, home: true, sort: 0  },
    { name: 'Auditorium/Theatre',       value: 22, home: true, sort: 1  },
    { name: 'Banquet Room',       value: 23, home: true, sort: 2  },
    { name: 'Bar/Lounge',       value: 24, home: true, sort: 3  },
    { name: 'Classroom/Training',       value: 25, home: true, sort: 5  },
    { name: 'Computer Lab',       value: 26, home: true, sort: 6 },
    { name: 'Conservatory',       value: 27, home: true, sort: 8  },
    { name: 'Courtyard',       value: 28, home: true, sort: 9  },
    { name: 'Event Hall',       value: 29, home: true, sort: 12  },
   { name: 'Fitness',       value: 30, home: true, sort: 14  },
   { name: 'Gallery',       value: 31, home: true, sort: 15  },
   { name: 'Library',       value: 32, home: true, sort: 19  },
   { name: 'Office',       value: 33, home: true, sort: 22  },
   { name: 'Park',       value: 34, home: true, sort: 24  },
   { name: 'Parking Lot',       value: 35, home: true, sort: 25  },
   { name: 'Patio',       value: 36, home: true, sort: 26  },
   { name: 'Warehouse/Storage',       value: 37, home: true, sort: 37  },
   { name: 'Workshop',  value: 38, home: true, sort: 38  },
   { name: 'Other',       value: 39, home: true, sort: 39  },
]

public readonly LEVELS_ENUM = [
  { display: 'First', value: 4 },
  { display: 'Second', value: 3 },
  { display: 'Third', value: 2 },
  { display: 'Fourth', value: 1 },
  { display: 'Everybody / Public', value: 0 }
];
public readonly LEAD_TIME_ENUM = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10
];
public readonly BOOKING_STATUS = [
  { title: 'Pending', value: 1 },
  { title: 'Approved', value: 2 },
  { title: 'Denied', value: -2 },
  { title: 'Cancelled', value: -1 },
];
public readonly ATTENDANCE_ENUM= [
  { value : 0    , label: 'N/A' },
  { value : 10    , label: 'Less than 10'},
  { value : 20    , label: '10-20'},
  { value : 50    , label: '20-50'},
  { value : 100   , label: '50-100'},
  { value : 200   , label: 'Up to 200'},
  { value : 300   , label: 'Up to 300'},
  { value : 400   , label: 'Up to 400'},
  { value : 500   , label: 'Up to 500'},
  { value : 1000  , label: 'Up to 1,000'},
  { value : 3000  , label: 'Up to 3,000'},
  { value : 3001  , label: '3,000+'}
];
public readonly ORIGIN_ENUM = [
  { title: 'Internal Only', value: 1},
  { title: 'External Only', value: 0},
];
public readonly AVAILABILITY_TITLE = 'Set availability';
public readonly NEW_AVAILABILITY_STATUS = 1;
public readonly EXCEPTION_TITLE = 'Set exception';
public readonly ASSIGN_SPACE_TITLE = 'Assign Space';
public readonly DAY_OF_WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
public readonly TIMES_OF_DAY = [

    {
        title: 'Any',
        startTime: '04:00',
        endTime: '24:00'
    },
    {
        title: 'Morning',
        startTime: '05:00',
        endTime: '11:00'
    },
    {
        title: 'Midday',
        startTime: '11:00',
        endTime: '17:00'
    },
    {
        title: 'Evening',
        startTime: '17:00',
        endTime: '23:00'
    },
];
public readonly SPACE_COLORS: { [key: number]: string } = {
  0: '#FF9900',
  1: '#996C3D',
  2: '#14CC30',
  3: '#00FFB6',
  4: '#FF3900',
  5: '#00B27F',
  6: '#BA2802',
  7: '#FFCC00',
  8: '#FF0D47',
  9: '#1786AD',
  10: '#7D23B4',
  11: '#00B9E6',
  12: '#996C3D',
  13: '#1786AD',
  14: '#FF9900',
  15: '#FF9900',
  16: '#0064FF',
  17: '#0064FF',
  18: 'rgb(27, 78, 155)',
  19: 'rgb(27, 91, 189)',
  20: 'rgb(40, 131, 67)',
  21: '#29456e',
  22: 'rgb(110, 23, 64)',
  23: 'rgb(228, 26, 103)',
  24: 'rgb(167, 42, 42)',
  25: 'rgb(97, 206, 35)',
  26: 'rgb(35, 174, 192)',
  27: 'rgb(182, 115, 115)',
  28: 'rgb(101, 140, 199)',
  29: 'rgb(100, 16, 62)',
  30: 'rgb(83, 124, 28)',
  31: 'rgb(75, 4, 54)',
  32: 'rgb(144, 188, 255)',
  33: 'rgb(66, 189, 183)',
  34: 'rgb(22, 47, 83)',
  35: 'rgb(255, 167, 2)',
  36: 'rgb(230, 39, 118)',
  37: 'rgb(157, 60, 223)',
  38: 'rgb(110, 209, 204)',
  39: 'rgb(39, 81, 145)'
};

public readonly RENTALSETTINGCONFIRMATION = 1;
public readonly REMOVEPRICINGCONFIRMATION = 2;
public readonly REMOVEALLPRICINGCONFIRMATION = 3;
public readonly PRICINGTOOLCONFIRAMTION = 4;
public readonly TIMEBLOCKCONFIRMATION = 5;
public readonly ORGDEPOSITCONFIRAMTION = 6;
public readonly REPLYCONFIRMATION = 7;
public readonly RULESANDATTACHMENTPDFCONFIRMATION = 8;
public readonly INSURANCECONFIRMATION = 9;
public readonly SWITCHSPACE = 10;
public readonly REMOVE_OPERATING_HOUR_CONFIRMATION = 11;
public readonly RENTABLESPACECONFIRMATION = 12;
public readonly VIEW_ORGANIZATION_PAGE= 1;
public readonly VIEW_FACILITY_PAGE= 2;
public readonly VIEW_SPACE_PAGE=3;
public readonly SEARCH_PAGE=1;
public readonly BOOKING_INFO_PAGE=4;
public readonly HOW_IT_WORKS='https://www.findspotz.com/how-spotz-works';
public readonly CREATE_LISTING = 'https://go.findspotz.com/host-signup';
public readonly MAX_DISTANCE = 25;
public readonly SPACES_PER_PAGE=6;
public readonly SPACES_TYPE = 1;
public readonly ALLOWED_CHARACTERS =/[^a-zA-Z0-9\s-]/g;
public readonly DAY_ABBREVIATIONS: { [key in 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday']: string } = {
    Monday: 'M',
    Tuesday: 'Tu',
    Wednesday: 'W',
    Thursday: 'Th',
    Friday: 'F',
    Saturday: 'Sa',
    Sunday: 'Su',
  };

    public readonly PRICING_LENGTH = 9;
    public readonly BUTTON_LENGTH = 40;
    public readonly NUM_PAGES = 4;
    public readonly ONE_DAY = 86400000;
    public readonly SECONDS = 6000;
    public readonly defaultTimeSpan = [10, 46];
    public readonly DEFAULT_RATES = {
        TRANSACTION: 0.04,
        USER: 0.05,
        HOST: {
          GROUP: 0,
          NON_GROUP: 0
        },
        INSURANCE: 0.0125
      };
    public readonly BOOKING_STEPS = {
        'AddedToCart': -1,
        'SCHEDULE': 0,
        'DETAILS': 1,
        'OPTIONS': 2,
        'PAYMENT': 3,
        'VERIFY': 4,
        'CONFIRMED': 5
    };
    public readonly EVENT_NAMES = [
      'Practice',
      'Scrimmage',
      'Training',
      'Meeting'
    ];
    public readonly mapDefaultHeight = "557px";
    public readonly bookingMapHeight = "286px";
    public readonly BEHALF_INFO = 'Let the host know what group you represent that is using the space. Not required.';
    public readonly AFFILIATIONS = ['None', '+ ADD NEW'];
    public readonly ACTIVITY_SPORTS =['Baseball', 'Basketball', 'Flag Football (youth)', 'Flag Football (adult)', 'Football (youth)', 'Football (adult)', 'Golf', 'Other'];
    public readonly AMERICANCARD="https://assets.braintreegateway.com/payment_method_logo/american_express.png";
    public readonly MASTERCARD="https://assets.braintreegateway.com/payment_method_logo/mastercard.png";
    public readonly VISACARD="https://assets.braintreegateway.com/payment_method_logo/visa.png";
    public readonly DISCOVERCARD="https://assets.braintreegateway.com/payment_method_logo/discover.png"  ;
    public readonly JCBCARD="https://assets.braintreegateway.com/payment_method_logo/jcb.png"  ;
    public readonly successStatus = 200;
    public readonly DEFAULT_HEIGHT = 1090;
    public readonly  DEFAULT_RESOURCE_THRESHOLD = 8;
    public readonly  MAX_RESOURCE_COLS = 8;
    public readonly OTHER_SPORT = 'other*';
}
