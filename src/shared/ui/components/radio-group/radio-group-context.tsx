import React from 'react';

export interface IRadioGroupContext {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioGroupContext = React.createContext<Partial<IRadioGroupContext>>({});
