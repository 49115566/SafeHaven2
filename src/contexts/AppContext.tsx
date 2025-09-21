import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Shelter, User } from '../types';

type AppAction =
  | { type: 'SET_CURRENT_SIDE'; payload: AppState['currentSide'] }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_SHELTER'; payload: Shelter }
  | { type: 'UPDATE_SHELTER'; payload: Shelter }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'UPDATE_SHELTER_STATUS'; payload: { shelterId: string; status: Shelter['status'] } };

const initialState: AppState = {
  shelters: [],
  users: [],
  currentUser: null,
  currentSide: 'landing'
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_SIDE':
      return { ...state, currentSide: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_SHELTER':
      // Ensure shelter has a valid status
      const shelterWithStatus = {
        ...action.payload,
        status: action.payload.status || 'no-action'
      };
      return { ...state, shelters: [...state.shelters, shelterWithStatus] };
    
    case 'UPDATE_SHELTER':
      return {
        ...state,
        shelters: state.shelters.map(shelter =>
          shelter.id === action.payload.id ? action.payload : shelter
        )
      };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_SHELTER_STATUS':
      return {
        ...state,
        shelters: state.shelters.map(shelter =>
          shelter.id === action.payload.shelterId
            ? { ...shelter, status: action.payload.status, lastUpdated: new Date().toISOString() }
            : shelter
        )
      };
    
    case 'LOAD_STATE':
      // Ensure all shelters have valid status when loading from localStorage
      const stateWithValidShelters = {
        ...action.payload,
        shelters: action.payload.shelters.map((shelter: any) => ({
          ...shelter,
          status: shelter.status || 'no-action'
        }))
      };
      return stateWithValidShelters;
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('safehaven-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('safehaven-state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}