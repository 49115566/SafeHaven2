import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useApp } from '../../contexts/AppContext';
import { Shelter, User } from '../../types';
import { ArrowLeft, MapPin, Building } from 'lucide-react';

export function ShelterAuth() {
  const { state, dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userName: '',
    shelterName: '',
    address: '',
    latitude: '',
    longitude: '',
    maxCapacity: '',
    otherInformation: ''
  });

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_SIDE', payload: 'landing' });
  };

  const handleLogin = (shelterId: string) => {
    const existingShelter = state.shelters.find(s => s.id === shelterId);
    if (!existingShelter) return;

    const user: User = {
      id: Date.now().toString(),
      name: formData.userName || 'Shelter User',
      type: 'shelter',
      shelterId: shelterId
    };

    dispatch({ type: 'ADD_USER', payload: user });
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  const handleRegister = () => {
    if (!formData.shelterName || !formData.address || !formData.maxCapacity) {
      alert('Please fill in all required fields');
      return;
    }

    const shelterId = Date.now().toString();
    
    const newShelter: Shelter = {
      id: shelterId,
      name: formData.shelterName,
      location: {
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        address: formData.address
      },
      capacity: {
        current: 0,
        maximum: parseInt(formData.maxCapacity)
      },
      needs: {
        food: 0,
        water: 0,
        medicalSupplies: 0,
        blankets: 0,
        clothing: 0,
        other: ''
      },
      status: 'no-action',
      otherInformation: formData.otherInformation,
      lastUpdated: new Date().toISOString()
    };

    const user: User = {
      id: Date.now().toString(),
      name: formData.userName || 'Shelter User',
      type: 'shelter',
      shelterId: shelterId
    };

    dispatch({ type: 'ADD_SHELTER', payload: newShelter });
    dispatch({ type: 'ADD_USER', payload: user });
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Shelter Portal</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Select Your Shelter' : 'Register New Shelter'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Choose from existing shelters or create a new one'
                : 'Create a new shelter in the system'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>

            {isLogin ? (
              <div>
                <Label>Select Shelter</Label>
                {state.shelters.length > 0 ? (
                  <Select onValueChange={handleLogin}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your shelter" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.shelters.map(shelter => (
                        <SelectItem key={shelter.id} value={shelter.id}>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {shelter.name} - {shelter.location.address}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-500 text-sm">No shelters registered yet. Please register a new shelter.</p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="shelterName">Shelter Name *</Label>
                  <Input
                    id="shelterName"
                    value={formData.shelterName}
                    onChange={(e) => setFormData(prev => ({ ...prev, shelterName: e.target.value }))}
                    placeholder="e.g., Community Center Shelter"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="40.7128"
                      type="number"
                      step="any"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="-74.0060"
                      type="number"
                      step="any"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxCapacity">Maximum Capacity *</Label>
                  <Input
                    id="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: e.target.value }))}
                    placeholder="Number of people"
                    type="number"
                  />
                </div>

                <div>
                  <Label htmlFor="otherInfo">Other Information</Label>
                  <Textarea
                    id="otherInfo"
                    value={formData.otherInformation}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherInformation: e.target.value }))}
                    placeholder="Special considerations, accessibility features, etc."
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2">
              {isLogin ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsLogin(false)}
                  className="flex-1"
                >
                  Register New Shelter
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsLogin(true)}
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                  <Button 
                    onClick={handleRegister}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Register Shelter
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}