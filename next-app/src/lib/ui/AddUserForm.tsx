'use client';

import { useState, useTransition } from 'react';
import { addUser } from '@/lib/actions/userActions';

interface AddUserFormProps {
  onUserAdded: () => void;
}

export function AddUserForm({ onUserAdded }: AddUserFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    
    startTransition(async () => {
      const result = await addUser(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Clear form and notify parent
        const form = document.getElementById('add-user-form') as HTMLFormElement;
        form?.reset();
        onUserAdded();
      }
    });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Add New User</h2>
      <form id="add-user-form" action={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{ display: 'block', marginTop: '5px', padding: '5px' }}
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            style={{ display: 'block', marginTop: '5px', padding: '5px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          style={{ padding: '5px 10px', cursor: isPending ? 'not-allowed' : 'pointer' }}
        >
          {isPending ? 'Adding...' : 'Add User'}
        </button>
      </form>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}
