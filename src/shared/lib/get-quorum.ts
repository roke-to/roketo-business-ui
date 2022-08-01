export const getQuorum = (ratio: string[]): number =>
  Array.isArray(ratio) && ratio.length !== 0
    ? (parseInt(ratio[0], 10) / parseInt(ratio[1], 10)) * 100
    : 0;
