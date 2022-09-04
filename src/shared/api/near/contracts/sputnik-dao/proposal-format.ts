import {ProposalVariant} from './proposal.types';

export const DATA_SEPARATOR = '$$$$';

// if absent should be empty string
interface DescriptionProperties {
  description: string;
  link?: string;
  variant?: `${ProposalVariant}`;
}

// astro-ui in most of proposals do `${details}${DATA_SEPARATOR}${externalUrl}`
// https://github.com/near-daos/astro-ui/blob/368a710439c907ff5295625e98e87b5685319df3/astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers.ts#L75
// and after it adds pVariant
// https://github.com/near-daos/astro-ui/blob/368a710439c907ff5295625e98e87b5685319df3/astro_2.0/features/CreateProposal/hooks/useSubmitProposal.tsx#L179
export const encodeDescription = ({
  description,
  link = '',
  variant,
}: DescriptionProperties): string =>
  [description, link, variant].filter((part) => (part ?? false) !== false).join(DATA_SEPARATOR);

function parseVariant(input: string): ProposalVariant | undefined {
  return input in ProposalVariant ? (input as ProposalVariant) : undefined;
}

export const decodeDescription = (rawDescrition: string): DescriptionProperties => {
  const [description, link = '', variant] = rawDescrition.split(DATA_SEPARATOR);
  return {description, link, variant: parseVariant(variant)};
};
