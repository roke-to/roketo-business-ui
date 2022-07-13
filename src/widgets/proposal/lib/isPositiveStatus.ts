import {Proposal} from '~/shared/api/astro';

export const isPositiveStatus = (status: Proposal['status']) => status === 'Approved';
