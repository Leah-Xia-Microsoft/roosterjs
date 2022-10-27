import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleParagraph } from '../../../lib/modelToDom/handlers/handleParagraph';
import { handleSegment as originalHandleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleParagraph', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleSegment: jasmine.Spy<ContentModelHandler<ContentModelSegment>>;

    beforeEach(() => {
        parent = document.createElement('div');
        handleSegment = jasmine.createSpy('handleSegment');
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                segment: handleSegment,
            },
        });
    });

    function runTest(
        paragraph: ContentModelParagraph,
        expectedInnerHTML: string,
        expectedCreateSegmentFromContentCalledTimes: number
    ) {
        handleParagraph(document, parent, paragraph, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleSegment).toHaveBeenCalledTimes(expectedCreateSegmentFromContentCalledTimes);
    }

    it('Handle empty explicit paragraph', () => {
        runTest(
            {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            },
            '<div></div>',
            0
        );
    });

    it('Handle empty implicit paragraph', () => {
        runTest(
            {
                blockType: 'Paragraph',
                segments: [],
                isImplicit: true,
                format: {},
            },
            '',
            0
        );
    });

    it('Handle paragraph with single text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        runTest(
            {
                blockType: 'Paragraph',
                segments: [segment],
                format: {},
            },
            '<div></div>',
            1
        );

        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment,
            context
        );
    });

    it('Handle implicit paragraph single text segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        runTest(
            {
                blockType: 'Paragraph',
                segments: [segment],
                isImplicit: true,
                format: {},
            },
            '',
            1
        );

        expect(handleSegment).toHaveBeenCalledWith(document, parent, segment, context);
    });

    it('Handle multiple segments', () => {
        const segment1: ContentModelSegment = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const segment2: ContentModelSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: null!,
            format: {},
        };
        runTest(
            {
                blockType: 'Paragraph',
                segments: [segment1, segment2],
                format: {},
            },
            '<div></div>',
            2
        );

        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment1,
            context
        );
        expect(handleSegment).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            segment2,
            context
        );
    });

    it('handle headers', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                headerLevel: 1,
                segments: [
                    {
                        segmentType: 'Text',
                        format: { bold: true },
                        text: 'test',
                    },
                ],
            },
            '<h1><span>test</span></h1>',
            1
        );
    });

    it('handle headers that has non-bold text', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                format: {},
                headerLevel: 1,
                segments: [
                    {
                        segmentType: 'Text',
                        format: { bold: true },
                        text: 'test 1',
                    },
                    {
                        segmentType: 'Text',
                        format: {},
                        text: 'test 2',
                    },
                ],
            },
            '<h1><span>test 1</span><span style="font-weight: normal;">test 2</span></h1>',
            2
        );
    });

    it('handle headers with implicit block and other inline format', () => {
        handleSegment.and.callFake(originalHandleSegment);

        runTest(
            {
                blockType: 'Paragraph',
                isImplicit: true,
                format: {},
                headerLevel: 1,
                segments: [
                    {
                        segmentType: 'Text',
                        format: { bold: true, italic: true },
                        text: 'test',
                    },
                ],
            },
            '<h1><span><i>test</i></span></h1>',
            1
        );
    });
});