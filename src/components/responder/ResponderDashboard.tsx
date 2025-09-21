import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useApp } from '../../contexts/AppContext';
import { Shelter, NEED_LABELS, STATUS_LABELS, User } from '../../types/index';
import { ArrowLeft, Users, MapPin, Navigation, AlertTriangle, Building } from 'lucide-react';
import { calculateDistance, getUserLocation } from '../../utils/distance';

// Fallback definitions in case import fails
const LOCAL_STATUS_LABELS = {
  'no-action': 'No Action Taken',
  'acknowledged': 'Acknowledged',
  'in-progress': 'In Progress',
  'completed': 'Completed'
} as const;

const LOCAL_NEED_LABELS = {
  0: 'No Need',
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Critical'
} as const;

export function ResponderDashboard() {
  const { state, dispatch } = useApp();
  const [responderLocation, setResponderLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [sortedShelters, setSortedShelters] = useState<Array<Shelter & {distance?: number}>>(state.shelters);
  const [responderName, setResponderName] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setSortedShelters(state.shelters);
  }, [state.shelters]);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_SIDE', payload: 'landing' });
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };

  const handleGetLocation = async () => {
    try {
      const position = await getUserLocation();
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      setResponderLocation(location);
      
      // Create or update user
      const user: User = {
        id: currentUser?.id || Date.now().toString(),
        name: responderName || 'First Responder',
        type: 'responder',
        location: location
      };
      
      if (!currentUser) {
        dispatch({ type: 'ADD_USER', payload: user });
        setCurrentUser(user);
      }
      
      // Sort shelters by distance
      const sheltersWithDistance = state.shelters.map(shelter => ({
        ...shelter,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          shelter.location.latitude,
          shelter.location.longitude
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setSortedShelters(sheltersWithDistance);
    } catch (error) {
      alert('Unable to get your location. Please ensure location permissions are enabled.');
    }
  };

  const handleStatusUpdate = (shelterId: string, status: Shelter['status']) => {
    dispatch({ type: 'UPDATE_SHELTER_STATUS', payload: { shelterId, status } });
  };

  const getStatusColor = (status: Shelter['status']) => {
    switch (status) {
      case 'no-action': return 'bg-gray-500';
      case 'acknowledged': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getNeedColor = (level: number) => {
    if (level === 0) return 'bg-gray-200 text-gray-700';
    if (level <= 2) return 'bg-green-200 text-green-800';
    if (level <= 3) return 'bg-yellow-200 text-yellow-800';
    return 'bg-red-200 text-red-800';
  };

  const getPriorityScore = (shelter: Shelter) => {
    const needsTotal = (shelter.needs.food ?? 0) + (shelter.needs.water ?? 0) + (shelter.needs.medicalSupplies ?? 0) + 
                     (shelter.needs.blankets ?? 0) + (shelter.needs.clothing ?? 0);
    const capacityRatio = shelter.capacity.current / shelter.capacity.maximum;
    return needsTotal + (capacityRatio * 10);
  };

  const criticalShelters = sortedShelters.filter(shelter => 
    (shelter.needs.food ?? 0) >= 4 || (shelter.needs.water ?? 0) >= 4 || (shelter.needs.medicalSupplies ?? 0) >= 4
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">First Responder Dashboard</h1>
                <p className="text-gray-600">Monitor and respond to emergency shelter needs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responder Info and Location */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Responder Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="responderName">Your Name</Label>
                <Input
                  id="responderName"
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <Button 
                onClick={handleGetLocation} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!responderName}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get My Location & Sort Shelters
              </Button>
              {responderLocation && (
                <p className="text-sm text-gray-600">
                  Location: {responderLocation.latitude.toFixed(4)}, {responderLocation.longitude.toFixed(4)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Critical Needs Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              {criticalShelters.length > 0 ? (
                <div className="space-y-2">
                  <p className="font-semibold">{criticalShelters.length} shelters need immediate attention</p>
                  {criticalShelters.slice(0, 3).map(shelter => (
                    <div key={shelter.id} className="text-sm">
                      • {shelter.name} - Critical needs detected
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600">No critical needs at this time</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Shelters List */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Shelters</CardTitle>
            <CardDescription>
              {sortedShelters.length} shelters in system
              {responderLocation && ' (sorted by distance)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedShelters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No shelters registered in the system yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedShelters.map((shelter) => (
                  <Card key={shelter.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{shelter.name}</h3>
                            <div className="flex items-center gap-2">
                              {shelter.distance && (
                                <Badge variant="outline" className="text-blue-600">
                                  {shelter.distance} miles
                                </Badge>
                              )}
                              <Badge className={`${getStatusColor(shelter.status || 'no-action')} text-white`}>
                                {(STATUS_LABELS || LOCAL_STATUS_LABELS)[shelter.status || 'no-action']}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {shelter.location.address}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Capacity</p>
                              <p className="font-semibold">{shelter.capacity.current}/{shelter.capacity.maximum}</p>
                            </div>
                            {[
                              { key: 'food' as const, label: 'Food' },
                              { key: 'water' as const, label: 'Water' },
                              { key: 'medicalSupplies' as const, label: 'Medical' },
                              { key: 'blankets' as const, label: 'Blankets' },
                              { key: 'clothing' as const, label: 'Clothing' }
                            ].map(({ key, label }) => (
                              <div key={key} className="text-center">
                                <p className="text-xs text-gray-500">{label}</p>
                                <Badge className={getNeedColor(shelter.needs[key] ?? 0)} size="sm">
                                  {(NEED_LABELS || LOCAL_NEED_LABELS)[shelter.needs[key] ?? 0]}
                                </Badge>
                              </div>
                            ))}
                          </div>

                          {(shelter.needs.other || shelter.otherInformation) && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {shelter.needs.other && <p><strong>Other needs:</strong> {shelter.needs.other}</p>}
                              {shelter.otherInformation && <p><strong>Info:</strong> {shelter.otherInformation}</p>}
                            </div>
                          )}
                        </div>

                        <div className="lg:w-48">
                          <Label className="text-sm">Update Status</Label>
                          <Select
                            value={shelter.status}
                            onValueChange={(value) => handleStatusUpdate(shelter.id, value as Shelter['status'])}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no-action">No Action</SelectItem>
                              <SelectItem value="acknowledged">Acknowledged</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            Updated: {new Date(shelter.lastUpdated).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}