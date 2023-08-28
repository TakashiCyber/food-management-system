import { createContext, useContext, useReducer, useEffect, useMemo, Dispatch, ReactNode } from 'react';
import axios from 'axios';

interface State {
  latestData: any[];
}

interface ProviderProps {
  children: ReactNode;
}

type Action = { type: string; payload: any };

type PartyContextType = [State, Dispatch<Action>];

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export function usePartyContext(): PartyContextType {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error('usePartyContext must be used within a PartyProvider');
  }
  return context;
}

function reducer(state: State, { type, payload }: Action): State {
  return {
    ...state,
    [type]: payload
  };
}

const INIT_STATE: State = {
  latestData: []
};

export default function Provider({ children }: ProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  useEffect(() => {
    (async () => {
      getLatestData();
    })();
    // eslint-disable-next-line
  }, []);

  const getLatestData = async () => {
    const result = await axios.get(`https://themealdb.com/api/json/v2/1/latest.php`);
    dispatch({
      type: 'latestData',
      payload: result.data.meals
    });
  };

  return <PartyContext.Provider value={useMemo(() => [state, dispatch], [state])}>{children}</PartyContext.Provider>;
}