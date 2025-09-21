import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
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
      maximum: amplifyData.maximumCapacity
    },
    needs: {
      food: amplifyData.foodNeed || 0,
      water: amplifyData.waterNeed || 0,
      medicalSupplies: amplifyData.medicalSuppliesNeed || 0,
      blankets: amplifyData.blanketsNeed || 0,
      clothing: amplifyData.clothingNeed || 0,
      other: amplifyData.otherNeeds || ''
    },
    status: amplifyData.status || 'no-action',
    otherInformation: amplifyData.otherInformation || '',
    lastUpdated: amplifyData.lastUpdated
  };
}

function mapShelterToAmplify(shelter: Shelter) {
  return {
    id: shelter.id,
    name: shelter.name,
    latitude: shelter.location.latitude,
    longitude: shelter.location.longitude,
    address: shelter.location.address,
    currentCapacity: shelter.capacity.current,
    maximumCapacity: shelter.capacity.maximum,
    foodNeed: shelter.needs.food,
    waterNeed: shelter.needs.water,
    medicalSuppliesNeed: shelter.needs.medicalSupplies,
    blanketsNeed: shelter.needs.blankets,
    clothingNeed: shelter.needs.clothing,
    otherNeeds: shelter.needs.other,
    status: shelter.status,
    otherInformation: shelter.otherInformation,
    lastUpdated: shelter.lastUpdated
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
    await client.models.Shelter.update(mapShelterToAmplify(shelter));
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