import {
    DefaultStyleMap,
    ElementProcessorMap,
    FormatParsers,
    FormatParsersPerCategory,
} from './DomToModelSettings';

/**
 * Options for creating DomToModelContext
 */
export interface DomToModelOption {
    /**
     * Overrides default element processors
     */
    processorOverride?: Partial<ElementProcessorMap>;

    /**
     * Overrides default element styles
     */
    defaultStyleOverride?: DefaultStyleMap;

    /**
     * Overrides default format handlers
     */
    formatParserOverride?: Partial<FormatParsers>;

    /**
     * Provide additional format parsers for each format type
     */
    additionalFormatParsers?: Partial<FormatParsersPerCategory>;
}