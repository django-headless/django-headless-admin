type DateTimeString = string;
type DateString = string;
type Id = string;
type Url = string;
type Email = string;

export interface SessionUser {
  id: Id;
  lastLogin: DateTimeString | null;
  firstName: string;
  lastName: string;
  email: Email;
  dateJoined: DateTimeString | null;
  createdAt: DateTimeString;
  editedAt: DateTimeString | null;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  profilePicture: Url | null;
  userPermissions: string[];
}

export interface AdminSite {
  siteHeader: string;
  siteTitle: string;
  indexTitle: string;
  siteUrl: string | null;
}

export interface ContentType {
  apiId: string;
  appLabel: string;
  appVerboseName: string;
  modelName: string;
  verboseName: string;
  verboseNamePlural: string;
  fields: Record<string, ContentTypeField>;
  admin: any;
}

export interface ContentTypeField {}
