
export enum searchRoutes {
  SEARCH = '/search',
  SEARCH_ORG_FAC = '/search/org/fac',

}

export enum manageRoutes {
  ADMIN_SPACE_CREATE="/admin/manage/org/space/new",
  ADMIN_FACILITY_CREATE="/admin/manage/org/facility/new",
  BASICS_PROFILE="/manage/account/profile",
  ACCOUNT_SETTINGS='/manage/account/settings',
  MEMBERSHIPS='/manage/account/memberships',
  RESERVATIONS='/manage/account/reservations',
  CALENDAR='/manage/account/calendar',
  PAYMENTS='/manage/account/payments',
}

export enum loginRoutes{
  LOGIN ="/"
}

export enum adminRoutes{
  ADMIN_DASHBOARD = "/admin/home/dashboard",
  ADMIN_ORG_CREATE ="/admin/orgs/new",
  ADMIN_ADDONS='admin/addons',
  ADMIN_REGIONS='admin/regions',
  ADMIN_INCIDENTS='admin/incidents',
  USER_DASHBOARD='/manage/home/dashboard'
}

export const USER_ROLES = {
  all: '*',
  superadmin: 'Superadmin',
  admin: 'Admin',
  approver: 'Approver',
  editor: 'Editor',
  maintenanceManager: 'Maintenance Manager',
  maintenanceStaff: 'Maintenance Staff'
};
