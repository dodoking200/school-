import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Home Icon - Blue gradient
export const HomeColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
    <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" 
      stroke="url(#homeGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Students Icon - Green gradient
export const StudentsColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="studentsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11ZM23 21V19C22.9986 17.1473 21.685 15.5511 19.9 15.13M16 3.13C17.8699 3.56 19.1717 5.32671 19.1717 7.38742C19.1717 9.44813 17.8699 11.2148 16 11.645" 
      stroke="url(#studentsGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Teachers Icon - Purple gradient
export const TeachersColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="teachersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
    </defs>
    <path d="M4.26 14C4.09 15.42 4 16.91 4 18.5C4 19.33 4.67 20 5.5 20S7 19.33 7 18.5C7 16.91 6.91 15.42 6.74 14M12 7L12 2M18 7L14 7.5L12 7L10 7.5L6 7C6 9.76142 8.23858 12 11 12H13C15.7614 12 18 9.76142 18 7ZM22 7C22 10.866 18.866 14 15 14M2 7C2 10.866 5.134 14 9 14M15 18.5C15 16.91 15.09 15.42 15.26 14M20 18.5C20 19.33 19.33 20 18.5 20S17 19.33 17 18.5C17 16.91 17.09 15.42 17.26 14" 
      stroke="url(#teachersGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Users Icon - Indigo gradient  
export const UsersColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="usersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
    </defs>
    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" 
      stroke="url(#usersGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Shield Icon - Red gradient
export const ShieldColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
      stroke="url(#shieldGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L16 9" 
      stroke="url(#shieldGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Calendar Icon - Orange gradient
export const CalendarColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="url(#calendarGradient)" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="url(#calendarGradient)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="url(#calendarGradient)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="url(#calendarGradient)" strokeWidth="2"/>
  </svg>
);

// Book Icon - Teal gradient
export const BookColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#0F766E" />
      </linearGradient>
    </defs>
    <path d="M4 19.5C4 18.119 5.119 17 6.5 17H20" stroke="url(#bookGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.119 22 4 20.881 4 19.5V4.5C4 3.119 5.119 2 6.5 2Z" stroke="url(#bookGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Building Icon - Cyan gradient
export const BuildingColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0E7490" />
      </linearGradient>
    </defs>
    <path d="M6 22V4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V22M6 22H18M6 22H2M18 22H22" stroke="url(#buildingGradient)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 6H14M10 10H14M10 14H14" stroke="url(#buildingGradient)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Attendance Icon - Pink gradient
export const AttendanceColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
    </defs>
    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="url(#attendanceGradient)" strokeWidth="2"/>
    <rect x="9" y="3" width="6" height="4" rx="2" stroke="url(#attendanceGradient)" strokeWidth="2"/>
    <path d="M9 12L11 14L15 10" stroke="url(#attendanceGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Search Icon - Gray gradient
export const SearchColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B7280" />
        <stop offset="100%" stopColor="#374151" />
      </linearGradient>
    </defs>
    <circle cx="11" cy="11" r="8" stroke="url(#searchGradient)" strokeWidth="2"/>
    <path d="m21 21-4.35-4.35" stroke="url(#searchGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Add Icon - Green gradient
export const AddColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="addGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#addGradient)" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke="url(#addGradient)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="url(#addGradient)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Edit Icon - Blue gradient
export const EditColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="editGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="url(#editGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="url(#editGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Delete Icon - Red gradient
export const DeleteColorIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="deleteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
    <path d="M3 6H21" stroke="url(#deleteGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="url(#deleteGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="url(#deleteGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="11" x2="10" y2="17" stroke="url(#deleteGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="14" y1="11" x2="14" y2="17" stroke="url(#deleteGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
