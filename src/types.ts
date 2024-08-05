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
  choices?: [string, string][] | null;
  resourceId?: string;
  schema?: JSONSchema;
  validation: {
    required: boolean;
  };
}

export enum FieldType {
  CharField = "CharField",
  DateField = "DateField",
  DateTimeField = "DateTimeField",
  EmailField = "EmailField",
  FlexField = "FlexField",
  ForeignKey = "ForeignKey",
  HTMLField = "HTMLField",
  ManyMediaField = "ManyMediaField",
  MediaField = "MediaField",
  PositiveIntegerField = "PositiveIntegerField",
  TextField = "TextField",
  URLField = "URLField",
  UUIDField = "UUIDField",
}

export interface JSONSchema {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
}

export interface JSONSchemaProperty {
  type: JSONSchemaType;
  verboseName?: string;
  minimum?: number;
  maximum?: number;
}

export enum JSONSchemaType {
  Integer = "integer",
  String = "string",
}
