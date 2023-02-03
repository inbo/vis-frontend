export interface SearchableSelectConfig {
    minQueryLength: number;
    searchPlaceholder: string,
    resultPlaceholder: string;
    noResultsMessage: string;
};

export class SearchableSelectConfigBuilder {
    private readonly _configuration: SearchableSelectConfig;

    constructor() {
        this._configuration = {
            minQueryLength: 3,
            searchPlaceholder: `Minstens 3 karakters...`,
            resultPlaceholder: 'Selecteer een waarde',
            noResultsMessage: 'Er zijn geen resultaten gevonden',
        };
    }

    minQueryLength(minQueryLength: number): SearchableSelectConfigBuilder {
        this._configuration.minQueryLength = minQueryLength;
        return this;
    }

    searchPlaceholder(searchPlaceholder: string): SearchableSelectConfigBuilder {
        this._configuration.searchPlaceholder = searchPlaceholder;
        return this;
    }

    resultPlaceholder(resultPlaceholder: string): SearchableSelectConfigBuilder {
        this._configuration.resultPlaceholder = resultPlaceholder;
        return this;
    }

    noResultsMessage(noResultsMessage: string): SearchableSelectConfigBuilder {
        this._configuration.noResultsMessage = noResultsMessage;
        return this;
    }

    build(): SearchableSelectConfig {
        return this._configuration;
    }
}
