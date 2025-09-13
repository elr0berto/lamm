'use client';

import { useState } from 'react';
import { GameWrapper } from '@/lib/ui/GameWrapper';
import { AddUserForm } from '@/lib/ui/AddUserForm';
import { getUsers } from '@/lib/actions/userActions';

interface User {
  id: number;
  email: string;
  username: string;
}

interface GameWithUsersProps {
  initialUsers: User[];
}

export function GameWithUsers({ initialUsers }: GameWithUsersProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshUsers = async () => {
    setIsRefreshing(true);
    try {
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to refresh users:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Phaser Game with User Management</h1>

      <AddUserForm onUserAdded={refreshUsers} />

      <div style={{ marginBottom: '20px' }}>
        <strong>Users count: {users.length}</strong>
        {isRefreshing && <span style={{ marginLeft: '10px', color: 'gray' }}>Refreshing...</span>}
      </div>

      <GameWrapper usersCount={users.length} />
    </div>
  );
}
