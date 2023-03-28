import { ContentModelSelectionMarker } from '../../../lib/publicTypes/segment/ContentModelSelectionMarker';
import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createEntity } from '../../../lib/modelApi/creators/createEntity';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { createText } from '../../../lib/modelApi/creators/createText';
import { deleteSelection } from '../../../lib/modelApi/selection/deleteSelections';
import { EntityOperation } from 'roosterjs-editor-types';

describe('deleteSelection - selectionOnly', () => {
    it('empty selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        model.blocks.push(para);

        const result = deleteSelection(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });

        expect(result.isChanged).toBeFalse();
        expect(result.insertPoint).toBeNull();
    });

    it('Single selection marker', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });

        para.segments.push(marker);
        model.blocks.push(para);

        const result = deleteSelection(model);

        expect(result.isChanged).toBeFalse();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single text selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test1', { fontSize: '10px' });

        text.isSelected = true;
        para.segments.push(text);
        model.blocks.push(para);

        const result = deleteSelection(model);

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple text selection in multiple paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text0 = createText('test0', { fontSize: '10px' });
        const text1 = createText('test1', { fontSize: '11px' });
        const text2 = createText('test2', { fontSize: '12px' });

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text0);
        para1.segments.push(text1);
        para2.segments.push(text2);

        model.blocks.push(para1);
        model.blocks.push(para2);

        const result = deleteSelection(model);

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '11px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test0',
                            format: { fontSize: '10px' },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '11px' },
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Divider selection', () => {
        const model = createContentModelDocument();
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model);

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('2 Divider selection and paragraph after it', () => {
        const model = createContentModelDocument();
        const divider1 = createDivider('div');
        const divider2 = createDivider('hr');
        const para1 = createParagraph();
        const para2 = createParagraph();

        divider1.isSelected = true;
        divider2.isSelected = true;
        model.blocks.push(para1, divider1, divider2, para2);

        const result = deleteSelection(model);

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Some table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();

        cell2.isSelected = true;

        table.cells[0].push(cell1, cell2);
        model.blocks.push(table);

        const result = deleteSelection(model);

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                isImplicit: false,
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
            path: [cell2, model],
            tableContext: {
                table: table,
                colIndex: 1,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    heights: [],
                    cells: [
                        [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blocks: [],
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        format: {},
                                        isImplicit: false,
                                        segments: [
                                            {
                                                segmentType: 'SelectionMarker',
                                                format: {},
                                                isSelected: true,
                                            },
                                            {
                                                segmentType: 'Br',
                                                format: {},
                                            },
                                        ],
                                    },
                                ],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                                isSelected: true,
                            },
                        ],
                    ],
                },
            ],
        });
    });

    it('All table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();

        cell.isSelected = true;

        table.cells[0].push(cell);
        model.blocks.push(table);

        const result = deleteSelection(model);

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('Entity selection, no callback', () => {
        const model = createContentModelDocument();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);
        model.blocks.push(entity);

        entity.isSelected = true;

        const result = deleteSelection(model);

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('Entity selection, callback returns false', () => {
        const model = createContentModelDocument();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);
        model.blocks.push(entity);

        entity.isSelected = true;

        const onDeleteEntity = jasmine.createSpy('onDeleteEntity').and.returnValue(false);
        const result = deleteSelection(model, { onDeleteEntity });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });

        expect(onDeleteEntity).toHaveBeenCalledWith(entity, EntityOperation.Overwrite);
    });

    it('Entity selection, callback returns true', () => {
        const model = createContentModelDocument();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);
        model.blocks.push(entity);

        entity.isSelected = true;

        const onDeleteEntity = jasmine.createSpy('onDeleteEntity').and.returnValue(true);
        const result = deleteSelection(model, { onDeleteEntity });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    wrapper: wrapper,
                    format: {},
                    isReadonly: true,
                    id: undefined,
                    type: undefined,
                    isSelected: true,
                },
            ],
        });

        expect(onDeleteEntity).toHaveBeenCalledWith(entity, EntityOperation.Overwrite);
    });

    it('delete with default format', () => {
        const model = createContentModelDocument({
            fontSize: '10pt',
        });
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model);
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: { fontSize: '10pt' },
            isSelected: true,
        };

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                },
            ],
            format: { fontSize: '10pt' },
        });
    });
});

describe('deleteSelection - forward', () => {
    it('empty selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });

        expect(result.isChanged).toBeFalse();
        expect(result.insertPoint).toBeNull();
    });

    it('Single selection marker', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });

        para.segments.push(marker);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeFalse();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker with text after', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const segment = createText('test');

        para.segments.push(marker, segment);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'est',
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker at end of paragraph', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker);
        para2.segments.push(text2);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker in empty paragraph with BR', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const text = createText('test');

        para1.segments.push(marker, br);
        para2.segments.push(text);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker in empty paragraph with double BRs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br1 = createBr();
        const br2 = createBr();
        const text = createText('test');

        para1.segments.push(marker, br1, br2);
        para2.segments.push(text);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
            ],
        });
    });

    it('Double selection marker in 2 paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker1 = createSelectionMarker({ fontSize: '10px' });
        const marker2 = createSelectionMarker({ fontSize: '20px' });
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker1);
        para2.segments.push(marker2, text2);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker before image', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const image = createImage('');

        para.segments.push(marker, image);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker before table', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const table = createTable(1);

        table.cells[0].push(createTableCell());
        para.segments.push(marker, br);
        model.blocks.push(para, table);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker before divider', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const divider = createDivider('hr');

        para.segments.push(marker, br);
        model.blocks.push(para, divider);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker before entity, no callback', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);

        para.segments.push(marker, br);
        model.blocks.push(para, entity);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker before entity, with callback returns false', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);

        para.segments.push(marker, br);
        model.blocks.push(para, entity);

        const onDeleteEntity = jasmine.createSpy('onDeleteEntity').and.returnValue(false);
        const result = deleteSelection(model, { direction: 'forward', onDeleteEntity });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(onDeleteEntity).toHaveBeenCalledWith(entity, EntityOperation.RemoveFromStart);
    });

    it('Single selection marker before entity, with callback returns true', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);

        para.segments.push(marker, br);
        model.blocks.push(para, entity);

        const onDeleteEntity = jasmine.createSpy('onDeleteEntity').and.returnValue(true);
        const result = deleteSelection(model, { direction: 'forward', onDeleteEntity });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    format: {},
                    wrapper: wrapper,
                    isReadonly: true,
                    id: undefined,
                    type: undefined,
                },
            ],
        });
        expect(onDeleteEntity).toHaveBeenCalledWith(entity, EntityOperation.RemoveFromStart);
    });

    it('Single selection marker before list item', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const listItem = createListItem([]);
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        listItem.blocks.push(para2);
        model.blocks.push(para1, listItem);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    levels: [],
                },
            ],
        });
    });

    it('Single selection marker before quote', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const quote = createQuote();
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        quote.blocks.push(para2);
        model.blocks.push(para1, quote);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: {},
                        },
                    ],
                    format: {},
                    quoteSegmentFormat: {},
                },
            ],
        });
    });

    it('Single selection marker is under quote', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const quote = createQuote();
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        quote.blocks.push(para1);
        model.blocks.push(quote, para2);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [quote, model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    format: { fontSize: '10px' },
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'test',
                                },
                            ],
                        },
                    ],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                },
            ],
        });
    });

    it('Single selection marker is under quote, next block is list', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const quote = createQuote();
        const listItem = createListItem([]);
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        quote.blocks.push(para1);
        listItem.blocks.push(para2);
        model.blocks.push(quote, listItem);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [quote, model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    format: { fontSize: '10px' },
                                    isSelected: true,
                                },
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'test',
                                },
                            ],
                        },
                    ],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
                    levels: [],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [],
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Single text selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1', { fontSize: '10px' });
        const text2 = createText('test2', { fontSize: '20px' });

        text1.isSelected = true;
        para.segments.push(text1, text2);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '20px' },
                            text: 'test2',
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple text selection in multiple paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text0 = createText('test0', { fontSize: '10px' });
        const text1 = createText('test1', { fontSize: '11px' });
        const text2 = createText('test2', { fontSize: '12px' });

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text0);
        para1.segments.push(text1);
        para2.segments.push(text2);

        model.blocks.push(para1);
        model.blocks.push(para2);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '11px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test0',
                            format: { fontSize: '10px' },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '11px' },
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Divider selection', () => {
        const model = createContentModelDocument();
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('2 Divider selection and paragraph after it', () => {
        const model = createContentModelDocument();
        const divider1 = createDivider('div');
        const divider2 = createDivider('hr');
        const para1 = createParagraph();
        const para2 = createParagraph();

        divider1.isSelected = true;
        divider2.isSelected = true;
        model.blocks.push(para1, divider1, divider2, para2);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Some table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();

        cell2.isSelected = true;

        table.cells[0].push(cell1, cell2);
        model.blocks.push(table);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                isImplicit: false,
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
            path: [cell2, model],
            tableContext: {
                table: table,
                colIndex: 1,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    heights: [],
                    cells: [
                        [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blocks: [],
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        format: {},
                                        isImplicit: false,
                                        segments: [
                                            {
                                                segmentType: 'SelectionMarker',
                                                format: {},
                                                isSelected: true,
                                            },
                                            {
                                                segmentType: 'Br',
                                                format: {},
                                            },
                                        ],
                                    },
                                ],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                                isSelected: true,
                            },
                        ],
                    ],
                },
            ],
        });
    });

    it('All table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();

        cell.isSelected = true;

        table.cells[0].push(cell);
        model.blocks.push(table);

        const result = deleteSelection(model, { direction: 'forward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('delete with default format', () => {
        const model = createContentModelDocument({
            fontSize: '10pt',
        });
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model, { direction: 'forward' });
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: { fontSize: '10pt' },
            isSelected: true,
        };

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                },
            ],
            format: { fontSize: '10pt' },
        });
    });
});

describe('deleteSelection - backward', () => {
    it('empty selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });

        expect(result.isChanged).toBeFalse();
        expect(result.insertPoint).toBeNull();
    });

    it('Single selection marker', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });

        para.segments.push(marker);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeFalse();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker with text before', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const segment = createText('test');

        para.segments.push(segment, marker);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'tes',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker at beginning of paragraph', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1);
        para2.segments.push(marker, text2);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker after empty paragraph with BR', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '10' });
        const para2 = createParagraph(false, { lineHeight: '12' });
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const text = createText('test');

        para1.segments.push(br);
        para2.segments.push(marker, text);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10' },
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '12' },
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker after empty paragraph with double BRs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '10' });
        const para2 = createParagraph(false, { lineHeight: '11' });
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br1 = createBr();
        const br2 = createBr();
        const text = createText('test');

        para1.segments.push(br1, br2);
        para2.segments.push(marker, text);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10' },
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '11' },
                    segments: [],
                },
            ],
        });
    });

    it('Double selection marker in 2 paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '10' });
        const para2 = createParagraph(false, { lineHeight: '11' });
        const marker1 = createSelectionMarker({ fontSize: '10px' });
        const marker2 = createSelectionMarker({ fontSize: '20px' });
        const text1 = createText('test1');
        const text2 = createText('test2');

        para1.segments.push(text1, marker1);
        para2.segments.push(marker2, text2);
        model.blocks.push(para1, para2);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10' },
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '11' },
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker after image', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const image = createImage('');

        para.segments.push(image, marker);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker after table', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const table = createTable(1);

        table.cells[0].push(createTableCell());
        para.segments.push(marker, br);
        model.blocks.push(table, para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker after divider', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const divider = createDivider('hr');

        para.segments.push(marker, br);
        model.blocks.push(divider, para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker after entity, no callback', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);

        para.segments.push(marker, br);
        model.blocks.push(entity, para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Single selection marker after entity, with callback returns false', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);

        para.segments.push(marker, br);
        model.blocks.push(entity, para);

        const onDeleteEntity = jasmine.createSpy('onDeleteEntity').and.returnValue(false);
        const result = deleteSelection(model, { direction: 'backward', onDeleteEntity });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(onDeleteEntity).toHaveBeenCalledWith(entity, EntityOperation.RemoveFromEnd);
    });

    it('Single selection marker after entity, with callback returns true', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();
        const wrapper = 'WRAPPER' as any;
        const entity = createEntity(wrapper, true);

        para.segments.push(marker, br);
        model.blocks.push(entity, para);

        const onDeleteEntity = jasmine.createSpy('onDeleteEntity').and.returnValue(true);
        const result = deleteSelection(model, { direction: 'backward', onDeleteEntity });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    format: {},
                    wrapper: wrapper,
                    isReadonly: true,
                    id: undefined,
                    type: undefined,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(onDeleteEntity).toHaveBeenCalledWith(entity, EntityOperation.RemoveFromEnd);
    });

    it('Single selection marker after list item', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '10' });
        const para2 = createParagraph(false, { lineHeight: '11' });
        const listItem = createListItem([]);
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        listItem.blocks.push(para2);
        model.blocks.push(listItem, para1);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para2,
            path: [listItem, model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'test',
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: { fontSize: '10px' },
                                    isSelected: true,
                                },
                            ],
                            format: { lineHeight: '11' },
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    levels: [],
                },
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10' },
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker after quote', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '10' });
        const para2 = createParagraph(false, { lineHeight: '11' });
        const quote = createQuote();
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        quote.blocks.push(para2);
        model.blocks.push(quote, para1);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para2,
            path: [quote, model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'test',
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: { fontSize: '10px' },
                                    isSelected: true,
                                },
                            ],
                            format: { lineHeight: '11' },
                        },
                    ],
                    format: {},
                    quoteSegmentFormat: {},
                },
                {
                    blockType: 'Paragraph',
                    format: { lineHeight: '10' },
                    segments: [],
                },
            ],
        });
    });

    it('Single selection marker is under quote', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '10' });
        const para2 = createParagraph(false, { lineHeight: '11' });
        const quote = createQuote();
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        quote.blocks.push(para1);
        model.blocks.push(para2, quote);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para2,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                    format: { lineHeight: '11' },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: { lineHeight: '10' },
                            segments: [],
                        },
                    ],
                    format: {},
                    quoteSegmentFormat: {},
                },
            ],
        });
    });

    it('Single selection marker is under quote, previous block is list', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph(false, { lineHeight: '10' });
        const para2 = createParagraph(false, { lineHeight: '11' });
        const quote = createQuote();
        const listItem = createListItem([]);
        const text = createText('test');
        const marker = createSelectionMarker({ fontSize: '10px' });
        const br = createBr();

        para1.segments.push(marker, br);
        para2.segments.push(text);
        quote.blocks.push(para1);
        listItem.blocks.push(para2);
        model.blocks.push(listItem, quote);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para2,
            path: [listItem, model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
                    levels: [],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'test',
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: { fontSize: '10px' },
                                    isSelected: true,
                                },
                            ],
                            format: { lineHeight: '11' },
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'Quote',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: { lineHeight: '10' },
                            segments: [],
                        },
                    ],
                    format: {},
                    quoteSegmentFormat: {},
                },
            ],
        });
    });

    it('Single text selection', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1', { fontSize: '10px' });
        const text2 = createText('test2', { fontSize: '20px' });

        text1.isSelected = true;
        para.segments.push(text1, text2);
        model.blocks.push(para);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '10px' },
                isSelected: true,
            },
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '20px' },
                            text: 'test2',
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple text selection in multiple paragraphs', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text0 = createText('test0', { fontSize: '10px' });
        const text1 = createText('test1', { fontSize: '11px' });
        const text2 = createText('test2', { fontSize: '12px' });

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text0);
        para1.segments.push(text1);
        para2.segments.push(text2);

        model.blocks.push(para1);
        model.blocks.push(para2);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: { fontSize: '11px' },
                isSelected: true,
            },
            paragraph: para1,
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test0',
                            format: { fontSize: '10px' },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '11px' },
                            isSelected: true,
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Divider selection', () => {
        const model = createContentModelDocument();
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('2 Divider selection and paragraph after it', () => {
        const model = createContentModelDocument();
        const divider1 = createDivider('div');
        const divider2 = createDivider('hr');
        const para1 = createParagraph();
        const para2 = createParagraph();

        divider1.isSelected = true;
        divider2.isSelected = true;
        model.blocks.push(para1, divider1, divider2, para2);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                },
            ],
        });
    });

    it('Some table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell1 = createTableCell();
        const cell2 = createTableCell();

        cell2.isSelected = true;

        table.cells[0].push(cell1, cell2);
        model.blocks.push(table);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                isImplicit: false,
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
            path: [cell2, model],
            tableContext: {
                table: table,
                colIndex: 1,
                rowIndex: 0,
                isWholeTableSelected: false,
            },
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    dataset: {},
                    widths: [],
                    heights: [],
                    cells: [
                        [
                            {
                                blockGroupType: 'TableCell',
                                format: {},
                                dataset: {},
                                spanAbove: false,
                                spanLeft: false,
                                isHeader: false,
                                blocks: [],
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        format: {},
                                        isImplicit: false,
                                        segments: [
                                            {
                                                segmentType: 'SelectionMarker',
                                                format: {},
                                                isSelected: true,
                                            },
                                            {
                                                segmentType: 'Br',
                                                format: {},
                                            },
                                        ],
                                    },
                                ],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                                isSelected: true,
                            },
                        ],
                    ],
                },
            ],
        });
    });

    it('All table cell selection', () => {
        const model = createContentModelDocument();
        const table = createTable(1);
        const cell = createTableCell();

        cell.isSelected = true;

        table.cells[0].push(cell);
        model.blocks.push(table);

        const result = deleteSelection(model, { direction: 'backward' });

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: true,
                    },
                ],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: false,
                },
            ],
        });
    });

    it('delete with default format', () => {
        const model = createContentModelDocument({
            fontSize: '10pt',
        });
        const divider = createDivider('div');

        divider.isSelected = true;
        model.blocks.push(divider);

        const result = deleteSelection(model, { direction: 'backward' });
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: { fontSize: '10pt' },
            isSelected: true,
        };

        expect(result.isChanged).toBeTrue();
        expect(result.insertPoint).toEqual({
            marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [marker],
                format: {},
                isImplicit: false,
            },
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [marker],
                    isImplicit: false,
                },
            ],
            format: { fontSize: '10pt' },
        });
    });
});