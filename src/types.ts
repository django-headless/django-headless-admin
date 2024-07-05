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
  admin: {
    fields: (string | string[])[] | null;
    exclude: string[] | null;
    listDisplay: string[];
    listDisplayLinks: string[];
  };
}

export interface ContentTypeField {
  default: unknown;
  type: FieldType;
  label: string;
  helpText: string;
  editable: boolean;
  isRelation?: boolean;
  toMany?: boolean;
  relatedModel?: string;
}

export enum FieldType {
  UUIDField = "UUIDField",
  ForeignKey = "ForeignKey",
  CharField = "CharField",
  HTMLField = "HTMLField",
  DateTimeField = "DateTimeField",
  DateField = "DateField",
  MediaField = "MediaField",
  ManyMediaField = "ManyMediaField",
  PositiveIntegerField = "PositiveIntegerField",
  URLField = "URLField",
  FlexField = "FlexField",
  TextField = "TextField",
}
