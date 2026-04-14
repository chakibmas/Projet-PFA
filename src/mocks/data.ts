import { User } from '@/shared/types/auth.types';
import { Club } from '@/shared/types/club.types';
import { Membership } from '@/shared/types/membership.types';
import { Event } from '@/shared/types/event.types';
import { Announcement } from '@/shared/types/announcement.types';
import { Document, TypeDocument } from '@/shared/types/document.types';
import { DashboardKPIs } from '@/shared/types/dashboard.types';
import { FAQ, ChatLog } from '@/shared/types/chatbot.types';

export const mockUser: User = {
  id: 'u1',
  email: 'admin@uniclubs.fr',
  firstName: 'Ahmed',
  lastName: 'Benali',
  role: 'PLATFORM_ADMIN',
  avatarUrl: '',
  createdAt: '2024-09-01T08:00:00Z',
};

export const mockClubs: Club[] = [
  {
    id: 'c1',
    name: 'Club Informatique & IA',
    description:
      'Un espace dédié aux passionnés de développement, intelligence artificielle, cybersécurité et nouvelles technologies. Rejoignez-nous pour des ateliers, hackathons et conférences.',
    category: 'Technologie',
    logoUrl: '',
    memberCount: 142,
    statut: 'VALIDE',
    adminId: 'u2',
    createdAt: '2024-09-10T10:00:00Z',
  },
  {
    id: 'c2',
    name: 'Club Entrepreneuriat',
    description:
      'Développez vos compétences entrepreneuriales, pitchez vos idées et rencontrez des mentors issus du monde professionnel.',
    category: 'Business',
    logoUrl: '',
    memberCount: 89,
    statut: 'VALIDE',
    adminId: 'u3',
    createdAt: '2024-09-12T10:00:00Z',
  },
  {
    id: 'c3',
    name: 'Club Théâtre & Arts',
    description:
      "Expression artistique, mise en scène et performances scéniques. Ouvert à tous les niveaux, débutants bienvenus !",
    category: 'Arts & Culture',
    logoUrl: '',
    memberCount: 54,
    statut: 'VALIDE',
    adminId: 'u4',
    createdAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'c4',
    name: 'Club Robotique',
    description:
      'Conception et programmation de robots. Participation aux compétitions nationales et internationales.',
    category: 'Technologie',
    logoUrl: '',
    memberCount: 37,
    statut: 'VALIDE',
    adminId: 'u5',
    createdAt: '2024-10-01T10:00:00Z',
  },
  {
    id: 'c5',
    name: 'Club Environnement',
    description:
      "Sensibilisation à l'écologie, projets de développement durable sur le campus et actions communautaires.",
    category: 'Environnement',
    logoUrl: '',
    memberCount: 68,
    statut: 'VALIDE',
    adminId: 'u6',
    createdAt: '2024-10-05T10:00:00Z',
  },
  {
    id: 'c6',
    name: 'Club Débat & Éloquence',
    description:
      'Perfectionnez votre prise de parole en public, participez à des tournois de débat et enrichissez votre esprit critique.',
    category: 'Communication',
    logoUrl: '',
    memberCount: 45,
    statut: 'ARCHIVE',
    adminId: 'u7',
    createdAt: '2024-10-10T10:00:00Z',
  },
];

export const mockMemberships: Membership[] = [
  {
    id: 'm1',
    clubId: 'c1',
    clubName: 'Club Informatique & IA',
    userId: 'u1',
    userFullName: 'Ahmed Benali',
    userEmail: 'admin@uniclubs.fr',
    status: 'APPROUVEE',
    motivation: 'Passionné de développement et IA.',
    cotisationPayee: true,
    appliedAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-21T10:00:00Z',
  },
  {
    id: 'm2',
    clubId: 'c2',
    clubName: 'Club Entrepreneuriat',
    userId: 'u1',
    userFullName: 'Ahmed Benali',
    userEmail: 'admin@uniclubs.fr',
    status: 'EN_ATTENTE',
    motivation: "Souhait de créer ma startup après l'université.",
    cotisationPayee: false,
    appliedAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 'm3',
    clubId: 'c1',
    clubName: 'Club Informatique & IA',
    userId: 'u10',
    userFullName: 'Sara Moukrim',
    userEmail: 'sara@etu.fr',
    status: 'EN_ATTENTE',
    motivation: 'Intéressée par le machine learning.',
    cotisationPayee: false,
    appliedAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'm4',
    clubId: 'c1',
    clubName: 'Club Informatique & IA',
    userId: 'u11',
    userFullName: 'Karim Lounis',
    userEmail: 'karim@etu.fr',
    status: 'EN_ATTENTE',
    motivation: 'Développeur web, curieux de tout.',
    cotisationPayee: false,
    appliedAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
  },
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    clubId: 'c1',
    clubName: 'Club Informatique & IA',
    title: 'Hackathon IA 2025',
    description:
      '48h pour concevoir une solution innovante basée sur l\'intelligence artificielle. Équipes de 3-5 personnes. Prix à la clé !',
    location: 'Amphithéâtre A – Bâtiment Informatique',
    startDate: '2025-04-15T09:00:00Z',
    endDate: '2025-04-17T18:00:00Z',
    maxParticipants: 100,
    registeredCount: 78,
    isPublic: true,
    requiresRegistration: true,
    checkInCode: 'HACK2025',
    createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'e2',
    clubId: 'c2',
    clubName: 'Club Entrepreneuriat',
    title: 'Pitch Day – Saison 4',
    description:
      'Présentez votre projet devant un jury de professionnels et investisseurs. 10 équipes sélectionnées. Candidatures ouvertes.',
    location: 'Salle de conférence – Bâtiment B',
    startDate: '2025-04-20T14:00:00Z',
    endDate: '2025-04-20T18:00:00Z',
    maxParticipants: 60,
    registeredCount: 45,
    isPublic: true,
    requiresRegistration: true,
    checkInCode: 'PITCH4',
    createdAt: '2025-03-10T10:00:00Z',
  },
  {
    id: 'e3',
    clubId: 'c4',
    clubName: 'Club Robotique',
    title: 'Atelier Arduino pour débutants',
    description:
      'Introduction pratique à Arduino. Pas de prérequis. Matériel fourni. Places limitées.',
    location: 'Lab FabLab – RDC',
    startDate: '2025-04-25T10:00:00Z',
    endDate: '2025-04-25T13:00:00Z',
    maxParticipants: 20,
    registeredCount: 20,
    isPublic: true,
    requiresRegistration: true,
    checkInCode: 'ARDU25',
    createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'e4',
    clubId: 'c3',
    clubName: 'Club Théâtre & Arts',
    title: 'Représentation de fin d\'année',
    description:
      'Venez assister à la représentation de notre pièce de théâtre. Entrée libre, sur invitation.',
    location: 'Salle des fêtes – Campus Centre',
    startDate: '2025-05-10T19:00:00Z',
    endDate: '2025-05-10T21:30:00Z',
    registeredCount: 120,
    isPublic: true,
    requiresRegistration: false,
    createdAt: '2025-03-20T10:00:00Z',
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    clubId: 'c1',
    clubName: 'Club Informatique & IA',
    title: 'Ouverture des inscriptions – Hackathon IA 2025',
    content:
      'Les inscriptions pour le Hackathon IA 2025 sont officiellement ouvertes ! Formez vos équipes et inscrivez-vous avant le 10 avril. Plus d\'infos sur la page événement.',
    targetRole: 'MEMBER',
    authorId: 'u2',
    authorName: 'Omar Idrissi',
    createdAt: '2025-03-01T12:00:00Z',
    isRead: false,
  },
  {
    id: 'a2',
    title: 'Maintenance plateforme – Samedi 12 avril',
    content:
      'La plateforme UniClubs sera en maintenance le samedi 12 avril de 02h00 à 06h00. Merci de votre compréhension.',
    authorId: 'u1',
    authorName: 'Ahmed Benali',
    createdAt: '2025-04-05T09:00:00Z',
    isRead: true,
  },
  {
    id: 'a3',
    clubId: 'c2',
    clubName: 'Club Entrepreneuriat',
    title: 'Nouveau mentor rejoint le club',
    content:
      'Nous avons le plaisir d\'accueillir M. Rachid Amrani, CEO de TechStartup MA, comme mentor officiel du Club Entrepreneuriat.',
    authorId: 'u3',
    authorName: 'Leila Hamidi',
    createdAt: '2025-04-02T15:00:00Z',
    isRead: false,
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'd1',
    clubId: 'c1',
    clubName: 'Club Informatique & IA',
    name: 'Règlement intérieur 2024-2025',
    description: 'Charte et règles de fonctionnement du club.',
    type: 'REGLEMENT' as TypeDocument,
    version: 1,
    fileUrl: '#',
    mimeType: 'application/pdf',
    sizeBytes: 245760,
    uploadedBy: 'Omar Idrissi',
    uploadedAt: '2024-09-10T10:00:00Z',
    visibleToRoles: ['MEMBER', 'CLUB_ADMIN'],
  },
  {
    id: 'd2',
    clubId: 'c2',
    clubName: 'Club Entrepreneuriat',
    name: 'Template Business Plan',
    description: 'Modèle de business plan pour les membres.',
    type: 'AUTRE' as TypeDocument,
    version: 1,
    fileUrl: '#',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 87040,
    uploadedBy: 'Leila Hamidi',
    uploadedAt: '2024-10-01T10:00:00Z',
    visibleToRoles: ['MEMBER', 'CLUB_ADMIN'],
  },
  {
    id: 'd3',
    name: 'Guide utilisation plateforme UniClubs',
    description: 'Manuel utilisateur complet.',
    type: 'AUTRE' as TypeDocument,
    version: 1,
    fileUrl: '#',
    mimeType: 'application/pdf',
    sizeBytes: 1048576,
    uploadedBy: 'Ahmed Benali',
    uploadedAt: '2024-09-01T10:00:00Z',
    visibleToRoles: ['MEMBER', 'CLUB_ADMIN', 'PLATFORM_ADMIN'],
  },
];

export const mockKPIs: DashboardKPIs = {
  totalClubs: 6,
  activeClubs: 5,
  pendingClubs: 1,
  totalMembers: 435,
  pendingMemberships: 2,
  totalEvents: 4,
  upcomingEvents: 4,
  totalRegistrations: 263,
  tauxParticipation: 65.5,
};

export const mockFAQs: FAQ[] = [
  {
    id: 'f1',
    question: 'Comment rejoindre un club ?',
    answer:
      'Accédez à la page Clubs, choisissez un club et cliquez sur "Rejoindre". Remplissez le formulaire de candidature. L\'administrateur du club examinera votre demande.',
    category: 'Adhésion',
    createdAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 'f2',
    question: 'Comment créer un événement ?',
    answer:
      'Seuls les administrateurs de club peuvent créer des événements. Rendez-vous dans "Événements" > "Nouvel événement" et remplissez le formulaire.',
    category: 'Événements',
    createdAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 'f3',
    question: 'Comment contacter le support ?',
    answer:
      'Envoyez un email à support@uniclubs.fr ou utilisez ce chatbot pour escalader votre demande.',
    category: 'Support',
    createdAt: '2024-09-01T10:00:00Z',
  },
];

export const mockLogs: ChatLog[] = [
  {
    id: 'l1',
    sessionId: 's1',
    userMessage: 'Comment rejoindre un club ?',
    botAnswer: 'Accédez à la page Clubs et cliquez sur "Rejoindre"...',
    escalated: false,
    feedback: 'POSITIVE',
    createdAt: '2025-04-07T10:00:00Z',
  },
  {
    id: 'l2',
    sessionId: 's2',
    userMessage: 'Mon adhésion est bloquée depuis 2 semaines',
    botAnswer: 'Je comprends votre frustration. Je vous redirige vers le support.',
    escalated: true,
    feedback: 'NEGATIVE',
    createdAt: '2025-04-07T11:00:00Z',
  },
];
