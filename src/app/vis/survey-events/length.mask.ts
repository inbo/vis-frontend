import {NullableMaskedNumber} from '../../shared-ui/nullable-numbermask.mask';

export const nullableNumberMask = (scale: number, min: number, max: number) => {
    return {
        mask: NullableMaskedNumber,
        scale,
        signed: true,
        thousandsSeparator: '',
        radix: '.',
        min,
        max,
    };
};
