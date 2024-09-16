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
  timezone: string;
  locale: string;
  userPermissions: string[];
}

export interface AdminSite {
  siteHeader: string;
  siteTitle: string;
  indexTitle: string;
  siteUrl: string | null;
  // Only available if logged in as admin user.
  widgets?: DashboardWidget[];
}

export interface DashboardWidget {
  colSpan: number;
  useJsx: boolean;
  html: string;
}

export interface ContentType {
  resourceId: string;
  isSingleton?: boolean;
  appLabel: string;
  appVerboseName: string;
  modelName: string;
  verboseName: string;
  verboseNamePlural: string;
  fields: Record<string, ContentTypeField>;
  admin: {
    fields: (string | string[])[] | null;
    sidebarFields: string[];
    exclude: string[] | null;
    readonlyFields: string[];
    listDisplay: string[];
    listDisplayLinks: string[];
    listPerPage: number;
    inlines: Inline[] | null;
    enableSearch: boolean;
    fieldConfig?: Record<string, { format?: string }>;
    permissions: {
      add: boolean;
      change: boolean;
      delete: boolean;
      view: boolean;
    };
  } | null;
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
    fileType?: "file" | "image" | "audio" | "video";
  };
}

export interface Inline {
  resourceId: string;
  fkName: string;
  fields: string[] | null;
  canDelete: boolean;
  canAdd: boolean;
  extra: number;
  minNum: number | null;
  maxNum: number | null;
}

export enum FieldType {
  AutoField = "AutoField",
  BooleanField = "BooleanField",
  NullBooleanField = "NullBooleanField",
  CharField = "CharField",
  DateField = "DateField",
  DateTimeField = "DateTimeField",
  DecimalField = "DecimalField",
  EmailField = "EmailField",
  FileField = "FileField",
  FlexField = "FlexField",
  ForeignKey = "ForeignKey",
  HTMLField = "HTMLField",
  IntegerField = "IntegerField",
  ManyMediaField = "ManyMediaField",
  ManyToManyField = "ManyToManyField",
  MediaField = "MediaField",
  MultipleChoiceField = "MultipleChoiceField",
  PositiveIntegerField = "PositiveIntegerField",
  PositiveSmallIntegerField = "PositiveSmallIntegerField",
  TagField = "TagField",
  TextField = "TextField",
  TimeField = "TimeField",
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
  Null = "null",
}

export interface RecentAction {
  id: number;
  changeMessage: string;
  changes: Record<string, any>[];
  objectId: string;
  objectResourceId: string;
  objectRepr: string;
  actionFlag: "ADDITION" | "CHANGE" | "DELETION";
  actionTime: DateTimeString;
}
