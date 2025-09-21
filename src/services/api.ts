import { Shelter, User } from '../types';

const API_BASE = 'http://localhost:3002/api';

export const api = {
  // Shelters
  async getShelters(): Promise<Shelter[]> {
    const response = await fetch(`${API_BASE}/shelters`);
    if (!response.ok) throw new Error('Failed to fetch shelters');
    return response.json();
  },

  async createShelter(shelter: Shelter): Promise<void> {
    const response = await fetch(`${API_BASE}/shelters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shelter)
    });
    if (!response.ok) throw new Error('Failed to create shelter');
  },

  async updateShelter(shelter: Shelter): Promise<void> {
    const response = await fetch(`${API_BASE}/shelters/${shelter.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shelter)
    });
    if (!response.ok) throw new Error('Failed to update shelter');
  },

  async updateShelterStatus(shelterId: string, status: Shelter['status']): Promise<void> {
    const response = await fetch(`${API_BASE}/shelters/${shelterId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update shelter status');
  },

  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async createUser(user: User): Promise<void> {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Failed to create user');
  }
};