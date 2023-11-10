import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton, SuperscriptButtonStringKey } from 'roosterjs-react';
import { toggleSuperscript } from 'roosterjs-content-model-api';

/**
 * @internal
 * "Superscript" button on the format ribbon
 */
export const superscriptButton: RibbonButton<SuperscriptButtonStringKey> = {
    key: 'buttonNameSuperscript',
    unlocalizedText: 'Superscript',
    iconName: 'Superscript',
    isChecked: formatState => formatState.isSuperscript,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleSuperscript(editor);
        }
        return true;
    },
};
