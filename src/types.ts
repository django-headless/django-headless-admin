export type DateTimeString = string;
export type DateString = string;
export type Id = string;
export type Url = string;
export type Email = string;

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
  isSingleton?: boolean;
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
    inlines: Inline[] | null;
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

export interface Inline {
  apiId: string;
  fkName: string;
  canDelete: boolean;
  extra: number;
  minNum: number | null;
  maxNum: number | null;
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
  ManyToManyField = "ManyToManyField",
  MediaField = "MediaField",
  IntegerField = "IntegerField",
  PositiveIntegerField = "PositiveIntegerField",
  PositiveSmallIntegerField = "PositiveSmallIntegerField",
  TextField = "TextField",
  URLField = "URLField",
  URLPathField = "URLPathField",
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
  Number = "number",
  String = "string",
}
