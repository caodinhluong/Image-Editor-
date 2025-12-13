import { Project, AnalyticData } from '../../types';

// --- TYPES ---
export interface TeamSpace {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  ownerId: string;
  memberCount: number;
  inviteLink: string;
  logo?: string;
  projects?: Project[];
  members?: SpaceMember[];
  teamCredits?: number;
}

export interface SpaceMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'lead' | 'member';
  joinedAt: string;
  isOnline: boolean;
}

export interface PendingInvite {
  id: string;
  spaceName: string;
  spaceSlug: string;
  inviterName: string;
  inviterAvatar: string;
  invitedAt: string;
  memberCount: number;
}

export interface JoinedSpace {
  id: string;
  name: string;
  slug: string;
  role: 'member';
  joinedAt: string;
  ownerName: string;
  // Full space data for demo
  spaceData?: TeamSpace;
}

// --- STORAGE KEYS ---
export const SPACE_STORAGE_KEY = 'repix_team_space'; // Legacy - single space
export const OWNED_SPACES_KEY = 'repix_owned_spaces'; // New - multiple owned spaces
export const PENDING_INVITES_KEY = 'repix_pending_invites';
export const JOINED_SPACES_KEY = 'repix_joined_spaces';
export const ACTIVE_SPACE_KEY = 'repix_active_space'; // 'own_<spaceId>' | 'joined_<spaceId>'

// --- MOCK DATA ---
export const mockProjects: Project[] = [
  { id: 'p1', name: 'Nike Summer Campaign', lastEdited: '2 mins ago', status: 'In Review', collaborators: ['A', 'B'], thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
  { id: 'p2', name: 'Gucci Product Launch', lastEdited: '1 hour ago', status: 'Approved', collaborators: ['C'], thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' },
  { id: 'p3', name: 'Watch Collection Assets', lastEdited: '4 hours ago', status: 'Draft', collaborators: ['A', 'C', 'D'], thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' },
];

export const analyticData: AnalyticData[] = [
  { name: 'Mon', views: 400, sales: 240, amt: 2400 },
  { name: 'Tue', views: 300, sales: 139, amt: 2210 },
  { name: 'Wed', views: 200, sales: 980, amt: 2290 },
  { name: 'Thu', views: 278, sales: 390, amt: 2000 },
  { name: 'Fri', views: 189, sales: 480, amt: 2181 },
  { name: 'Sat', views: 239, sales: 380, amt: 2500 },
  { name: 'Sun', views: 349, sales: 430, amt: 2100 },
];

export const teamMembers = [
  { id: 'u0', name: 'Bạn', role: 'Lead', avatar: 'https://picsum.photos/seed/user/50/50' },
  { id: 'u1', name: 'Sarah Designer', role: 'Member', avatar: 'https://picsum.photos/seed/user1/50/50' },
  { id: 'u2', name: 'Mike Product', role: 'Member', avatar: 'https://picsum.photos/seed/user2/50/50' },
];

// Default pending invites for demo
export const defaultPendingInvites: PendingInvite[] = [
  {
    id: 'inv1',
    spaceName: 'Repix Design Studio',
    spaceSlug: 'repix-design',
    inviterName: 'Sarah Designer',
    inviterAvatar: 'https://picsum.photos/seed/sarah/50/50',
    invitedAt: '2 giờ trước',
    memberCount: 8
  },
  {
    id: 'inv2',
    spaceName: 'Creative Agency Team',
    spaceSlug: 'creative-agency',
    inviterName: 'Mike Creative',
    inviterAvatar: 'https://picsum.photos/seed/mike/50/50',
    invitedAt: '1 ngày trước',
    memberCount: 15
  }
];

// Demo data for joined spaces (full space data)
export const generateJoinedSpaceData = (invite: PendingInvite): JoinedSpace => {
  const spaceData: TeamSpace = {
    id: `space_${invite.id}`,
    name: invite.spaceName,
    slug: invite.spaceSlug,
    description: `${invite.spaceName} - Collaborative workspace`,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    ownerId: invite.inviterName,
    memberCount: invite.memberCount,
    inviteLink: `https://repix.ai/join/${invite.spaceSlug}`,
    teamCredits: Math.floor(Math.random() * 1500) + 500,
    projects: [
      { 
        id: `${invite.spaceSlug}_p1`, 
        name: `${invite.spaceName} - Main Campaign`, 
        lastEdited: '30 mins ago', 
        status: 'In Review', 
        collaborators: ['You', invite.inviterName.split(' ')[0]], 
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop' 
      },
      { 
        id: `${invite.spaceSlug}_p2`, 
        name: 'Brand Assets Collection', 
        lastEdited: '2 hours ago', 
        status: 'Approved', 
        collaborators: ['Team'], 
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop' 
      },
      { 
        id: `${invite.spaceSlug}_p3`, 
        name: 'Social Media Templates', 
        lastEdited: '1 day ago', 
        status: 'Draft', 
        collaborators: ['You'], 
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop' 
      },
    ],
    members: [
      { id: 'lead', name: invite.inviterName, email: `${invite.inviterName.toLowerCase().replace(' ', '.')}@company.com`, avatar: invite.inviterAvatar, role: 'lead', joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), isOnline: true },
      { id: 'you', name: 'Bạn (Member)', email: 'you@repix.ai', avatar: 'https://picsum.photos/seed/user/50/50', role: 'member', joinedAt: new Date().toISOString(), isOnline: true },
      { id: 'm1', name: 'Alex Developer', email: 'alex@company.com', avatar: 'https://picsum.photos/seed/alex/50/50', role: 'member', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), isOnline: false },
      { id: 'm2', name: 'Emma Marketing', email: 'emma@company.com', avatar: 'https://picsum.photos/seed/emma/50/50', role: 'member', joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), isOnline: true },
    ]
  };

  return {
    id: `joined_${invite.id}`,
    name: invite.spaceName,
    slug: invite.spaceSlug,
    role: 'member',
    joinedAt: new Date().toISOString(),
    ownerName: invite.inviterName,
    spaceData
  };
};
