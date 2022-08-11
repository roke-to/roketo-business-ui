export type Employee = {
  id: string;
  status: 'Active' | 'Suspended' | 'Fired';
  type: 'Contractor' | 'Freelancer';
  name: string;
  role: string;
  wallet: string;
  email: string;
  salary: string;
  startDate: string;
  period: string;
  payoutType: string;
  token: 'near';
  comment?: string;
};
