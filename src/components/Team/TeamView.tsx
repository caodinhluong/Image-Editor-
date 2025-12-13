import React, { useState, useEffect } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { 
  TeamSpace, 
  PendingInvite, 
  JoinedSpace,
  SPACE_STORAGE_KEY,
  OWNED_SPACES_KEY,
  PENDING_INVITES_KEY,
  JOINED_SPACES_KEY,
  ACTIVE_SPACE_KEY,
  defaultPendingInvites,
  generateJoinedSpaceData
} from './types';
import { UpgradeToTeamScreen } from './UpgradeToTeamScreen';
import { CreateSpaceScreen } from './CreateSpaceScreen';
import { JoinSpaceScreen } from './JoinSpaceScreen';
import { PendingInvitesScreen } from './PendingInvitesScreen';
import { SpaceDashboard } from './SpaceDashboard';

export const TeamView: React.FC = () => {
  const { isTeam, triggerUpgradeModal } = useSubscription();
  
  // View state
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'join' | 'invites'>('dashboard');
  const [selectedInvite, setSelectedInvite] = useState<PendingInvite | null>(null);
  
  // Active space: 'own_<spaceId>' for owned space, or 'joined_<spaceId>' for joined space
  const [activeSpaceId, setActiveSpaceId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACTIVE_SPACE_KEY) || '';
    }
    return '';
  });
  
  // Multiple owned spaces - persisted to localStorage
  const [ownedSpaces, setOwnedSpaces] = useState<TeamSpace[]>(() => {
    if (typeof window !== 'undefined') {
      // Try new key first
      const stored = localStorage.getItem(OWNED_SPACES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Migrate from old single space key
      const oldStored = localStorage.getItem(SPACE_STORAGE_KEY);
      if (oldStored) {
        const oldSpace = JSON.parse(oldStored);
        return [oldSpace];
      }
    }
    return [];
  });

  // Pending invites - persisted to localStorage
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PENDING_INVITES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return defaultPendingInvites;
  });

  // Joined spaces - persisted to localStorage
  const [joinedSpaces, setJoinedSpaces] = useState<JoinedSpace[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(JOINED_SPACES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as JoinedSpace[];
        // Migrate old data: generate spaceData if missing
        return parsed.map(space => {
          if (!space.spaceData) {
            const spaceData: TeamSpace = {
              id: `space_${space.id}`,
              name: space.name,
              slug: space.slug,
              description: `${space.name} - Collaborative workspace`,
              createdAt: space.joinedAt,
              ownerId: space.ownerName,
              memberCount: 5,
              inviteLink: `https://repix.ai/join/${space.slug}`,
              teamCredits: Math.floor(Math.random() * 1500) + 500,
              projects: [
                { 
                  id: `${space.slug}_p1`, 
                  name: `${space.name} - Main Campaign`, 
                  lastEdited: '30 mins ago', 
                  status: 'In Review', 
                  collaborators: ['You', space.ownerName.split(' ')[0]], 
                  thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop' 
                },
                { 
                  id: `${space.slug}_p2`, 
                  name: 'Brand Assets Collection', 
                  lastEdited: '2 hours ago', 
                  status: 'Approved', 
                  collaborators: ['Team'], 
                  thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop' 
                },
              ],
              members: [
                { id: 'lead', name: space.ownerName, email: `${space.ownerName.toLowerCase().replace(' ', '.')}@company.com`, avatar: 'https://picsum.photos/seed/owner/50/50', role: 'lead' as const, joinedAt: space.joinedAt, isOnline: true },
                { id: 'you', name: 'Bạn (Member)', email: 'you@repix.ai', avatar: 'https://picsum.photos/seed/user/50/50', role: 'member' as const, joinedAt: new Date().toISOString(), isOnline: true },
              ]
            };
            return { ...space, spaceData };
          }
          return space;
        });
      }
    }
    return [];
  });

  // Set default active space if not set
  useEffect(() => {
    if (!activeSpaceId && ownedSpaces.length > 0) {
      setActiveSpaceId(`own_${ownedSpaces[0].id}`);
    }
  }, [ownedSpaces, activeSpaceId]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(OWNED_SPACES_KEY, JSON.stringify(ownedSpaces));
    // Also update legacy key for backward compatibility
    if (ownedSpaces.length > 0) {
      localStorage.setItem(SPACE_STORAGE_KEY, JSON.stringify(ownedSpaces[0]));
    }
  }, [ownedSpaces]);

  useEffect(() => {
    localStorage.setItem(PENDING_INVITES_KEY, JSON.stringify(pendingInvites));
  }, [pendingInvites]);

  useEffect(() => {
    localStorage.setItem(JOINED_SPACES_KEY, JSON.stringify(joinedSpaces));
  }, [joinedSpaces]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_SPACE_KEY, activeSpaceId);
  }, [activeSpaceId]);

  // Handlers
  const handleCreateSpace = (space: TeamSpace) => {
    setOwnedSpaces(prev => [...prev, space]);
    setActiveSpaceId(`own_${space.id}`);
    setCurrentView('dashboard');
  };

  const handleDeleteSpace = (spaceId: string) => {
    setOwnedSpaces(prev => prev.filter(s => s.id !== spaceId));
    // Switch to another space if deleting current
    if (activeSpaceId === `own_${spaceId}`) {
      const remaining = ownedSpaces.filter(s => s.id !== spaceId);
      if (remaining.length > 0) {
        setActiveSpaceId(`own_${remaining[0].id}`);
      } else if (joinedSpaces.length > 0) {
        setActiveSpaceId(`joined_${joinedSpaces[0].id}`);
      } else {
        setActiveSpaceId('');
      }
    }
  };

  // Legacy compatibility - get first owned space as "teamSpace"
  const teamSpace = ownedSpaces.length > 0 ? ownedSpaces[0] : null;

  const handleSelectInvite = (invite: PendingInvite) => {
    setSelectedInvite(invite);
    setCurrentView('join');
  };

  const handleJoinSpace = (invite: PendingInvite) => {
    // Generate full space data for demo - always join as member
    const newJoinedSpace = generateJoinedSpaceData(invite);
    setJoinedSpaces(prev => [...prev, newJoinedSpace]);
    
    // Remove from pending
    setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
    setSelectedInvite(null);
    
    // Switch to the newly joined space
    setActiveSpaceId(`joined_${newJoinedSpace.id}`);
    setCurrentView('dashboard');
  };

  const handleSwitchSpace = (spaceId: string) => {
    setActiveSpaceId(spaceId);
    setCurrentView('dashboard');
  };

  const handleLeaveSpace = (joinedSpaceId: string) => {
    setJoinedSpaces(prev => prev.filter(s => s.id !== joinedSpaceId));
    if (activeSpaceId === `joined_${joinedSpaceId}`) {
      // Switch to first owned space or first joined space
      if (ownedSpaces.length > 0) {
        setActiveSpaceId(`own_${ownedSpaces[0].id}`);
      } else if (joinedSpaces.length > 1) {
        const remaining = joinedSpaces.filter(s => s.id !== joinedSpaceId);
        setActiveSpaceId(`joined_${remaining[0].id}`);
      } else {
        setActiveSpaceId('');
      }
    }
  };

  // Get current active space data
  const getActiveSpace = (): { space: TeamSpace | null; isOwned: boolean; userRole: 'lead' | 'member' } => {
    if (activeSpaceId.startsWith('own_')) {
      const spaceId = activeSpaceId.replace('own_', '');
      const space = ownedSpaces.find(s => s.id === spaceId);
      return { space: space || null, isOwned: true, userRole: 'lead' };
    }
    if (activeSpaceId.startsWith('joined_')) {
      const spaceId = activeSpaceId.replace('joined_', '');
      const joinedSpace = joinedSpaces.find(s => s.id === spaceId);
      return { space: joinedSpace?.spaceData || null, isOwned: false, userRole: 'member' };
    }
    // Legacy support for 'own' without id
    if (activeSpaceId === 'own' && ownedSpaces.length > 0) {
      return { space: ownedSpaces[0], isOwned: true, userRole: 'lead' };
    }
    return { space: null, isOwned: false, userRole: 'member' };
  };

  const { space: activeSpace, isOwned: isViewingOwnSpace, userRole } = getActiveSpace();

  const handleDeclineInvite = (inviteId: string) => {
    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    setSelectedInvite(null);
    if (pendingInvites.length <= 1 && ownedSpaces.length === 0) {
      setCurrentView('create');
    } else {
      setCurrentView('invites');
    }
  };

  // FLOW 1: Not on Team plan → Show upgrade screen
  if (!isTeam) {
    return <UpgradeToTeamScreen onUpgrade={() => triggerUpgradeModal('teamWorkspace')} />;
  }

  // FLOW 2: Viewing a specific invite to join
  if (currentView === 'join' && selectedInvite) {
    return (
      <JoinSpaceScreen 
        invite={selectedInvite}
        onJoin={handleJoinSpace}
        onDecline={handleDeclineInvite}
      />
    );
  }

  // FLOW 3: Has pending invites and no own space → Show invites list
  if (currentView === 'invites' || (ownedSpaces.length === 0 && pendingInvites.length > 0 && currentView !== 'create')) {
    return (
      <PendingInvitesScreen
        invites={pendingInvites}
        onSelectInvite={handleSelectInvite}
        onCreateSpace={() => setCurrentView('create')}
        hasOwnSpace={ownedSpaces.length > 0}
      />
    );
  }

  // FLOW 4: Creating new space (first time or adding new)
  if (currentView === 'create' || (ownedSpaces.length === 0 && joinedSpaces.length === 0 && pendingInvites.length === 0)) {
    return <CreateSpaceScreen onCreateSpace={handleCreateSpace} />;
  }

  // FLOW 5: Has Team plan and space → Show dashboard
  if (activeSpace) {
    const currentJoinedSpaceId = activeSpaceId.startsWith('joined_') ? activeSpaceId.replace('joined_', '') : null;
    const currentOwnedSpaceId = activeSpaceId.startsWith('own_') ? activeSpaceId.replace('own_', '') : null;
    
    return (
      <SpaceDashboard 
        space={activeSpace}
        onDeleteSpace={() => {
          if (isViewingOwnSpace && currentOwnedSpaceId) {
            handleDeleteSpace(currentOwnedSpaceId);
          } else if (currentJoinedSpaceId) {
            handleLeaveSpace(currentJoinedSpaceId);
          }
        }}
        joinedSpaces={joinedSpaces}
        pendingInvitesCount={pendingInvites.length}
        onViewInvites={() => setCurrentView('invites')}
        ownedSpaces={ownedSpaces}
        activeSpaceId={activeSpaceId}
        onSwitchSpace={handleSwitchSpace}
        onCreateNewSpace={() => setCurrentView('create')}
        isOwnSpace={isViewingOwnSpace}
        userRole={userRole}
      />
    );
  }

  // Fallback: No spaces at all, show create screen
  return <CreateSpaceScreen onCreateSpace={handleCreateSpace} />;
};
