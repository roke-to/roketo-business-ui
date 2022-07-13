import React, {useState} from 'react';

import {Tab, TabsList} from '~/shared/ui/components/tabs';

export const ProposalStatusFilter = () => {
  const [selected, setSelected] = useState('all');

  const handleChange = (status: any) => {
    console.log('PROPOSAL STATUS ->', status);
    setSelected(status);
  };

  return (
    <TabsList value={selected} onChange={handleChange}>
      <Tab value='all'>All proposals</Tab>
      <Tab value='active'>Active</Tab>
      <Tab value='approved'>Approved</Tab>
      <Tab value='failed'>Failed</Tab>
    </TabsList>
  );
};
