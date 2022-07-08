export enum Action {
  // Action to add proposal. Used internally.
  AddProposal,
  // Action to remove given proposal. Used for immediate deletion in special cases.
  RemoveProposal,
  // Vote to approve given proposal or bounty.
  VoteApprove,
  // Vote to reject given proposal or bounty.
  VoteReject,
  // Vote to remove given proposal or bounty (because it's spam).
  VoteRemove,
  // Finalize proposal, called when it's expired to return the funds
  // (or in the future can be used for early proposal closure).
  Finalize,
  // Move a proposal to the hub to shift into another DAO.
  MoveToHub,
}
