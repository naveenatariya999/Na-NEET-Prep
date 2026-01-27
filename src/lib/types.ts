import type { Timestamp } from 'firebase/firestore';

export type StudyMaterial = {
  id: string;
  title: string;
  subject: string;
  createdAt: Timestamp;
  visible: boolean;
  url: string;
  adminId: string;
  contentType: 'notes' | 'pyq' | 'video' | 'mindmap' | 'pdf';
};
