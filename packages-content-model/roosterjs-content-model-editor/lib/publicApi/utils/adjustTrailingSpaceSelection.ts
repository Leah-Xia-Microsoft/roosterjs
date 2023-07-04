import { createText } from 'roosterjs-content-model-dom';
import { ContentModelParagraph, ContentModelSegment } from 'roosterjs-content-model-types';

/**
 * Remove trailing space from the selection
 * If the trailing space is in a separate segment, remove the format from that segment.
 * @internal
 */
export function adjustTrailingSpaceSelection(
    segment: ContentModelSegment | null,
    paragraph: ContentModelParagraph | null
): [ContentModelSegment | null, ContentModelParagraph | null] {
    if (segment && segment.segmentType == 'Text' && paragraph) {
        const text = segment.text.trimRight();
        const trailingSpacing = segment.text.substring(text.length);
        if (text && trailingSpacing) {
            segment.text = text;
            const trailingSpacingSegment = createText(trailingSpacing);
            trailingSpacingSegment.format = {};
            trailingSpacingSegment.isSelected = false;
            paragraph.segments.push(trailingSpacingSegment);
        } else {
            const trailingSpacingSegment = paragraph.segments[paragraph.segments.length - 1];
            if (
                trailingSpacingSegment.segmentType == 'Text' &&
                trailingSpacingSegment.text.trim().length == 0
            ) {
                trailingSpacingSegment.format = {};
            }
        }
    }
    return [segment, paragraph];
}