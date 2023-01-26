import IMask from 'imask';

// Default Numbermask returns 0 if the input is empty, this implementation returns undefined when the input is empty.
// There is a github issue about this, but the developer does not agree that an empty input should give value null.

export class NullableMaskedNumber extends IMask.MaskedNumber {

    // @ts-ignore
    get typedValue(): number {
        return this.unmaskedValue !== ''
            ? super.typedValue
            : undefined;
    }

    set typedValue(num: number) {
        super.typedValue = num;
    }
}
