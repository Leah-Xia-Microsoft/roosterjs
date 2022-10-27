import { defaultContentModelHandlers } from './defaultContentModelHandlers';
import { EditorContext } from '../../publicTypes/context/EditorContext';
import { getFormatAppliers } from '../../formatHandlers/defaultFormatHandlers';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { ModelToDomOption } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 * @param editorContext
 * @returns
 */
export function createModelToDomContext(
    editorContext?: EditorContext,
    options?: ModelToDomOption
): ModelToDomContext {
    return {
        ...(editorContext || {
            isDarkMode: false,
            isRightToLeft: false,
            zoomScale: 1,
            getDarkColor: undefined,
        }),
        regularSelection: {
            current: {
                block: null,
                segment: null,
            },
        },
        listFormat: {
            threadItemCounts: [],
            nodeStack: [],
        },
        segmentFormatFromBlock: {},
        formatAppliers: getFormatAppliers(
            options?.formatApplierOverride,
            options?.additionalFormatAppliers
        ),
        modelHandlers: {
            ...defaultContentModelHandlers,
            ...(options?.modelHandlerOverride || {}),
        },
        entityPairs: [],
    };
}