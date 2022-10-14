import {decodeDescription, encodeDescription} from './proposal-format';

describe('encodeDescription', () => {
  it('should fully separate data', () => {
    expect(
      encodeDescription({
        description: 'description',
        link: 'link',
        variant: 'ProposeRemoveMember',
      }),
    ).toEqual('description$$$$link$$$$ProposeRemoveMember');
  });
  it('should separate data with only desc and link', () => {
    expect(
      encodeDescription({
        description: 'description',
        link: 'link',
      }),
    ).toEqual('description$$$$link');
  });
  it('should separate data with only desc', () => {
    expect(
      encodeDescription({
        description: 'description',
      }),
    ).toEqual('description$$$$');
  });
  it('should separate data with only desc', () => {
    expect(
      encodeDescription({
        description: 'description',
        variant: 'ProposeRemoveMember',
      }),
    ).toEqual('description$$$$$$$$ProposeRemoveMember');
  });
});

describe('decodeDescription', () => {
  it('should decode when all data present', () => {
    expect(decodeDescription('description$$$$link$$$$ProposeRemoveMember')).toMatchObject({
      description: 'description',
      link: 'link',
      variant: 'ProposeRemoveMember',
    });
  });
  it('should decode when only description and link present', () => {
    expect(decodeDescription('description$$$$link')).toMatchObject({
      description: 'description',
      link: 'link',
      variant: undefined,
    });
    expect(decodeDescription('description$$$$link$$$$')).toMatchObject({
      description: 'description',
      link: 'link',
      variant: undefined,
    });
  });
  it('should decode when only description and variant present', () => {
    expect(decodeDescription('description$$$$$$$$ProposeRemoveMember')).toMatchObject({
      description: 'description',
      link: '',
      variant: 'ProposeRemoveMember',
    });
  });
  it('should not parse wrong variant', () => {
    expect(decodeDescription('description$$$$$$$$ProposeSomething')).toMatchObject({
      description: 'description',
      link: '',
      variant: undefined,
    });
  });
  it('should decode when only description present', () => {
    expect(decodeDescription('description$$$$$$$$')).toMatchObject({
      description: 'description',
      link: '',
      variant: undefined,
    });
    expect(decodeDescription('description$$$$')).toMatchObject({
      description: 'description',
      link: '',
      variant: undefined,
    });
    expect(decodeDescription('description')).toMatchObject({
      description: 'description',
      link: '',
      variant: undefined,
    });
  });
});
