// src/contexts/EmployeeContext.test.tsx

import { render, screen } from '@testing-library/react';
import React, { useContext } from 'react';
import { EmployeeContext, EmployeeContextType } from './EmployeeContext';

describe('EmployeeContext', () => {
  it('deve ter valor undefined por padrão', () => {
    let contextValue: EmployeeContextType | undefined;
    
    const TestComponent = () => {
      contextValue = useContext(EmployeeContext);
      return null;
    };

    render(<TestComponent />);
    expect(contextValue).toBeUndefined();
  });
});
