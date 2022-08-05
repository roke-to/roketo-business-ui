import {AnyFields, Field, FormValues} from 'effector-forms';

export interface BaseChangePolicyProposalFormFields extends AnyFields {
  councilAddress: Field<string>;
  quorum: Field<number>;
  description: Field<string>;
}

export type ChangePolicyProposalFormValues = FormValues<BaseChangePolicyProposalFormFields>;
