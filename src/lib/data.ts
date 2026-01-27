export const subjects = [
  {
    id: 'physics',
    name: 'Physics',
    description: 'Master the concepts of mechanics, thermodynamics, electricity, and more.',
    chapters: 10,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Explore organic, inorganic, and physical chemistry principles.',
    chapters: 12,
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Delve into the study of life, from molecular biology to ecology.',
    chapters: 15,
  },
];

export const pyqs = [
  { year: 2023, subject: 'Physics', questions: 45, available: true },
  { year: 2023, subject: 'Chemistry', questions: 45, available: true },
  { year: 2023, subject: 'Biology', questions: 90, available: true },
  { year: 2022, subject: 'Physics', questions: 45, available: true },
  { year: 2022, subject: 'Chemistry', questions: 45, available: false },
  { year: 2022, subject: 'Biology', questions: 90, available: true },
  { year: 2021, subject: 'Physics', questions: 45, available: true },
  { year: 2021, subject: 'Chemistry', questions: 45, available: true },
  { year: 2021, subject: 'Biology', questions: 90, available: false },
];

export const videos = [
  { id: '1', title: 'Introduction to Vectors', subject: 'Physics', videoId: 'dQw4w9WgXcQ' },
  { id: '2', title: 'Organic Chemistry Basics', subject: 'Chemistry', videoId: 'dQw4w9WgXcQ' },
  { id: '3', title: 'Cell Structure and Function', subject: 'Biology', videoId: 'dQw4w9WgXcQ' },
  { id: '4', title: 'Laws of Motion Explained', subject: 'Physics', videoId: 'dQw4w9WgXcQ' },
];

export const mindMaps = [
  {
    id: '1',
    title: 'Human Anatomy Overview',
    subject: 'Biology',
    imageId: 'mind-map-1',
  },
  {
    id: '2',
    title: 'Organic Chemistry Reactions',
    subject: 'Chemistry',
    imageId: 'mind-map-2',
  },
  {
    id: '3',
    title: 'Newtonian Physics',
    subject: 'Physics',
    imageId: 'mind-map-3',
  },
];

export const adminDashboardStats = {
  totalNotes: 150,
  totalPyqs: 5,
  totalVideos: 25,
  totalMindMaps: 10,
};

export const adminNotes = [
  { id: 'bio-001', title: 'The Living World', subject: 'Biology', lastUpdated: '2023-10-27', visible: true },
  { id: 'phy-001', title: 'Units and Measurements', subject: 'Physics', lastUpdated: '2023-10-26', visible: true },
  { id: 'chem-001', title: 'Some Basic Concepts of Chemistry', subject: 'Chemistry', lastUpdated: '2023-10-25', visible: false },
  { id: 'bio-002', title: 'Biological Classification', subject: 'Biology', lastUpdated: '2023-10-24', visible: true },
];
