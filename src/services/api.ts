import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Shelter, User } from '../types';

const client = generateClient<Schema>();

function mapShelterFromAmplify(amplifyData: any): Shelter {
  return {
    id: amplifyData.id,
    name: amplifyData.name,
    location: {
      latitude: amplifyData.latitude,
      longitude: amplifyData.longitude,
      address: amplifyData.address
    },
    capacity: {
      current: amplifyData.currentCapacity || 0,
      maximum: amplifyData.maxCapacity
    },
    needs: {
      food: amplifyData.needsFood ? 3 : 0,
      water: amplifyData.needsWater ? 3 : 0,
      medicalSupplies: amplifyData.needsMedical ? 3 : 0,
      blankets: amplifyData.needsBlankets ? 3 : 0,
      clothing: amplifyData.needsClothing ? 3 : 0,
      other: amplifyData.otherInfo || ''
    },
    status: amplifyData.status || 'no-action',
    otherInformation: amplifyData.otherInfo || '',
    lastUpdated: amplifyData.updatedAt || new Date().toISOString()
  };
}

function mapShelterToAmplify(shelter: Shelter) {
  return {
    name: shelter.name,
    latitude: shelter.location.latitude,
    longitude: shelter.location.longitude,
    address: shelter.location.address,
    currentCapacity: shelter.capacity.current,
    maxCapacity: shelter.capacity.maximum,
    needsFood: shelter.needs.food > 0,
    needsWater: shelter.needs.water > 0,
    needsMedical: shelter.needs.medicalSupplies > 0,
    needsBlankets: shelter.needs.blankets > 0,
    needsClothing: shelter.needs.clothing > 0,
    status: shelter.status,
    otherInfo: shelter.otherInformation
  };
}

function mapUserFromAmplify(amplifyData: any): User {
  return {
    id: amplifyData.id,
    name: amplifyData.name,
    type: amplifyData.type,
    shelterId: amplifyData.shelterId,
    location: amplifyData.latitude && amplifyData.longitude ? {
      latitude: amplifyData.latitude,
      longitude: amplifyData.longitude
    } : undefined,
    address: amplifyData.address
  };
}

function mapUserToAmplify(user: User) {
  return {
    id: user.id,
    name: user.name,
    type: user.type,
    shelterId: user.shelterId,
    latitude: user.location?.latitude,
    longitude: user.location?.longitude,
    address: user.address
  };
}

export const api = {
  // Shelters
  async getShelters(): Promise<Shelter[]> {
    const { data } = await client.models.Shelter.list();
    return data.map(mapShelterFromAmplify);
  },

  async createShelter(shelter: Shelter): Promise<void> {
    await client.models.Shelter.create(mapShelterToAmplify(shelter));
  },

  async updateShelter(shelter: Shelter): Promise<void> {
    await client.models.Shelter.update({
      id: shelter.id,
      ...mapShelterToAmplify(shelter)
    });
  },

  async updateShelterStatus(shelterId: string, status: Shelter['status']): Promise<void> {
    await client.models.Shelter.update({
      id: shelterId,
      status,
      lastUpdated: new Date().toISOString()
    });
  },

  // Users
  async getUsers(): Promise<User[]> {
    const { data } = await client.models.User.list();
    return data.map(mapUserFromAmplify);
  },

  async createUser(user: User): Promise<void> {
    await client.models.User.create(mapUserToAmplify(user));
  }
};