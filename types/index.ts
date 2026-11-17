export type CourseLevel = 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  mentor: {
    name: string;
    role: string;
    company: string;
  };
  lessonsCount: number;
  hoursCount: number;
  hasCertificate: boolean;
  originalPrice: number;
  discountedPrice: number;
  tags: string[];
  thumbnailType: 'fullstack' | 'microservices' | 'ai' | 'algorithms' | 'devops' | 'distributed';
  description: string;
  syllabusHighlights: string[];
}

export interface CertificateRecord {
  id: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  grade: string;
  score: number;
  verificationHash: string;
  mentorName: string;
  mentorRole: string;
  skillsAcquired: string[];
  status: 'Verified' | 'Revoked' | 'In Audit';
}

export type DemoRole = 'visitor' | 'student' | 'mentor' | 'superadmin';

export interface UserSession {
  role: DemoRole;
  name: string;
  email: string;
  tagline: string;
  avatarColor: string;
  badgeText: string;
}

