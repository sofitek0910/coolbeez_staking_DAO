import { createContext, Dispatch, SetStateAction } from 'react';

export interface ITheme {
  theme: string
}

export interface AppContextProperties {
  theme:ITheme,
  setTheme: Dispatch<SetStateAction<ITheme>>
}

const AppContext = createContext<AppContextProperties>({ 
  theme: {
    theme: 'light'
  },
  setTheme: () => {}
});

export { AppContext };
