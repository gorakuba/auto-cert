export interface Participant {
  id: string;
  name: string;
  email?: string;
  company?: string;
  score?: number;
  completionDate?: string;
  certificateNumber?: string;
  additionalData?: Record<string, string>;
}

export interface TemplateInfo {
  id: string;
  name: string;
  thumbnail: string;
  path: string;
  description: string;
  category?: "business" | "education" | "sport" | "custom" | "other";
  isCustom?: boolean;
  createdAt?: number;
  tags?: string[];
}

export interface RecentProject {
  id: string;
  templateId: string;
  templateName: string;
  templateThumbnail: string;
  participants: Participant[];
  participantsCount: number;
  lastEdited: number;
}
