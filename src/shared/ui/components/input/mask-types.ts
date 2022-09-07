import {IMaskInputProps} from 'react-imask/dist/mixin';

export interface MaskOptions {
  postfix?: string;
}

interface MaskInnerOptions extends MaskOptions {
  value?: string;
}

const numberMask = (): IMaskInputProps => ({
  mask: Number,
  thousandsSeparator: ' ',
  overwrite: false,
  unmask: false,
  radix: '.',
});

const postfixMask = ({value, postfix = ''}: MaskInnerOptions = {}): IMaskInputProps => ({
  // 0 - any digit
  // a - any letter
  // * - any char
  // so it should be treated as fixed it should be escaped by \\
  // https://imask.js.org/guide.html#masked-pattern
  mask: `text${postfix.replace('a', '\\a').replace('*', '\\*').replace('0', '\\0')}`,
  blocks: {
    text: {
      mask: /\w+/,
      lazy: true,
    },
  },
  // make placeholder always visible
  lazy: !value,
  overwrite: false,
});

const percentMask = (): IMaskInputProps => ({
  mask: 'number%',
  blocks: {
    number: {
      mask: Number,
      min: 1,
      max: 100,
      lazy: true,
      autofix: true,
    },
  },
  lazy: false,
  overwrite: false,
});

export const maskTypes = {
  number: numberMask,
  percent: percentMask,
  postfix: postfixMask,
};
