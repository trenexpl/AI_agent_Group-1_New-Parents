export type TabType = 'home' | 'search' | 'credits' | 'upcoming' | 'profile';

export type CategoryType =
  | 'All'
  | 'Coding & Robotics'
  | 'Speech & Drama'
  | 'Art & Pottery'
  | 'Creative Writing'
  | 'Gymnastics & Dance'
  | 'Sports & Physical Development';

export interface ClassSession {
  id: string;
  studioId: string;
  studioName: string;
  title: string;
  instructor: string;
  instructorImage?: string;
  time: string;
  date: string;
  credits: number;
  originalCredits?: number;
  location: string;
  distance: string;
  category: CategoryType;
  forKids?: boolean;
  ageRange?: string;
}

export interface Review {
  id: string;
  studioId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedParent?: boolean;
}

export interface Studio {
  id: string;
  name: string;
  category: CategoryType;
  distance: string;
  location: string;
  credits: number;
  rating: number;
  reviewCount: number;
  badge?: 'Top Rated' | 'Great' | 'Popular' | 'New';
  image: string;
  altText: string;
  description: string;
  address: string;
  amenities: string[];
  nextAvailable: {
    time: string;
    className: string;
    credits: number;
    instructor: string;
  };
  upcomingClasses: ClassSession[];
  reviews?: Review[];
}

export interface Booking {
  id: string;
  classSession: ClassSession;
  bookedAt: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookedFor: string; // e.g., 'Alex Johnson' or 'Leo Johnson (Age 8)'
}

export interface UserProfile {
  name: string;
  membership: string;
  credits: number;
  renewalDate: string;
  avatarUrl: string;
  email: string;
  familyMembers: { id: string; name: string; age: number; relation: string }[];
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  priceSGD: number;
  popular?: boolean;
  tag?: string;
}
