import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApiPlaygroundPlugin from './sidePane/contentModelApiPlayground/ApiPlaygroundPlugin';
import ContentModelEditorOptionsPlugin from './sidePane/editorOptions/ContentModelEditorOptionsPlugin';
import ContentModelEventViewPlugin from './sidePane/eventViewer/ContentModelEventViewPlugin';
import ContentModelFormatPainterPlugin from './contentModel/plugins/ContentModelFormatPainterPlugin';
import ContentModelFormatStatePlugin from './sidePane/formatState/ContentModelFormatStatePlugin';
import ContentModelPanePlugin from './sidePane/contentModel/ContentModelPanePlugin';
import ContentModelRibbon from './ribbonButtons/contentModel/ContentModelRibbon';
import ContentModelRooster from './contentModel/editor/ContentModelRooster';
import ContentModelSnapshotPlugin from './sidePane/snapshot/ContentModelSnapshotPlugin';
import getToggleablePlugins from './getToggleablePlugins';
import MainPaneBase, { MainPaneBaseState } from './MainPaneBase';
import RibbonPlugin from './ribbonButtons/contentModel/RibbonPlugin';
import SampleEntityPlugin from './sampleEntity/SampleEntityPlugin';
import SidePane from './sidePane/SidePane';
import TitleBar from './titleBar/TitleBar';
import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelRibbonPlugin } from './ribbonButtons/contentModel/ContentModelRibbonPlugin';
import { ContentModelSegmentFormat, Snapshots } from 'roosterjs-content-model-types';
import { createEmojiPlugin, createPasteOptionPlugin } from 'roosterjs-react';
import {
    EditorPlugin,
    IEditor,
    PickerDataProvider,
    PickerPluginOptions,
} from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { PartialTheme } from '@fluentui/react/lib/Theme';
import { trustedHTMLHandler } from '../utils/trustedHTMLHandler';
import {
    ContentModelAutoFormatPlugin,
    ContentModelEditPlugin,
    ContentModelPastePlugin,
} from 'roosterjs-content-model-plugins';
import {
    ContentModelEditor,
    ContentModelEditorOptions,
    IContentModelEditor,
} from 'roosterjs-content-model-editor';

import { PickerPlugin } from 'roosterjs-editor-plugins';
import { DefaultButton } from '@fluentui/react/lib/Button';

const styles = require('./ContentModelEditorMainPane.scss');

const LightTheme: PartialTheme = {
    palette: {
        themePrimary: '#cc6688',
        themeLighterAlt: '#080405',
        themeLighter: '#211016',
        themeLight: '#3d1f29',
        themeTertiary: '#7a3d52',
        themeSecondary: '#b45a78',
        themeDarkAlt: '#d17392',
        themeDark: '#d886a1',
        themeDarker: '#e2a3b8',
        neutralLighterAlt: '#f8f8f8',
        neutralLighter: '#f4f4f4',
        neutralLight: '#eaeaea',
        neutralQuaternaryAlt: '#dadada',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c8c8',
        neutralTertiary: '#595959',
        neutralSecondary: '#373737',
        neutralPrimaryAlt: '#2f2f2f',
        neutralPrimary: '#000000',
        neutralDark: '#151515',
        black: '#0b0b0b',
        white: '#ffffff',
    },
};

const DarkTheme: PartialTheme = {
    palette: {
        themePrimary: '#cb6587',
        themeLighterAlt: '#fdf8fa',
        themeLighter: '#f7e3ea',
        themeLight: '#f0ccd8',
        themeTertiary: '#e09db4',
        themeSecondary: '#d27694',
        themeDarkAlt: '#b85c7a',
        themeDark: '#9b4e67',
        themeDarker: '#72394c',
        neutralLighterAlt: '#3c3c3c',
        neutralLighter: '#444444',
        neutralLight: '#515151',
        neutralQuaternaryAlt: '#595959',
        neutralQuaternary: '#5f5f5f',
        neutralTertiaryAlt: '#7a7a7a',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#333333',
    },
};

interface ContentModelMainPaneState extends MainPaneBaseState {
    editorCreator: (div: HTMLDivElement, options: ContentModelEditorOptions) => IContentModelEditor;
}

class ContentModelEditorMainPane extends MainPaneBase<ContentModelMainPaneState> {
    private formatStatePlugin: ContentModelFormatStatePlugin;
    private editorOptionPlugin: ContentModelEditorOptionsPlugin;
    private eventViewPlugin: ContentModelEventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private contentModelPanePlugin: ContentModelPanePlugin;
    private contentModelEditPlugin: ContentModelEditPlugin;
    private contentModelAutoFormatPlugin: ContentModelAutoFormatPlugin;
    private contentModelRibbonPlugin: RibbonPlugin;
    private pasteOptionPlugin: EditorPlugin;
    private emojiPlugin: EditorPlugin;
    private mentionPlugin: PickerPlugin;
    private snapshotPlugin: ContentModelSnapshotPlugin;
    private toggleablePlugins: EditorPlugin[] | null = null;
    private formatPainterPlugin: ContentModelFormatPainterPlugin;
    private pastePlugin: ContentModelPastePlugin;
    private sampleEntityPlugin: SampleEntityPlugin;
    private insertElementIntoEditor?: (elementToInsert: HTMLElement) => void;
    private editor: IEditor | null = null;

    getPickerDataProvider = (): PickerDataProvider => {
        return {
            onInitalize: (
                insertNodeCallback: (nodeToInsert: HTMLElement) => void,
                setIsSuggestingCallback: (isSuggesting: boolean) => void,
                editor: IEditor
            ): void => {
                this.insertElementIntoEditor = insertNodeCallback;
                // this.setIsSuggestingShowPicker = setIsSuggestingCallback;
                this.editor = editor;
            },
            onDispose: (): void => {},

            onIsSuggestingChanged: (isSuggesting: boolean): void => {
                // this.setIsSuggestingShowPicker && this.setIsSuggestingShowPicker(isSuggesting);
                console.log('onIsSuggestingChanged::: ', isSuggesting);
                // const node = this.editor?.getDocument().createElement('span');
                // node.innerText = 'Leah';
                // this.insertElementIntoEditor(node);
                // this.setUIUtilities({renderComponent:})
            },

            queryStringUpdated: (queryString: string, _isExactMatch: boolean): void => {
                // this.debouncedQueryUpdate(queryString);
                console.log('queryStringUpdated::: ', queryString);
            },

            setCursorPoint: (point: { x: number; y: number }): void => {
                // this.setSuggestedTextCursorLocation = point;
                console.log('setCursorPoint::: ', point);
            },

            onRemove: (_nodeRemoved: Node, _isBackwards: boolean): Node => {
                alert(`${_nodeRemoved}, _isBackwards: ${_isBackwards}`);

                return document.createTextNode('');
            },
            onContentChanged: (elementIds: string[]) => {
                console.log('onContentChanged::: ', elementIds);
            },
        };
    };

    getPickerOption = (): PickerPluginOptions => {
        return {
            elementIdPrefix: 'msft-mention',
            changeSource: 'AtMention',
            triggerCharacter: '@',
        };
    };
    private snapshots: Snapshots;

    constructor(props: {}) {
        super(props);

        this.snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 1e7,
        };

        this.formatStatePlugin = new ContentModelFormatStatePlugin();
        this.editorOptionPlugin = new ContentModelEditorOptionsPlugin();
        this.eventViewPlugin = new ContentModelEventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new ContentModelSnapshotPlugin(this.snapshots);
        this.contentModelPanePlugin = new ContentModelPanePlugin();
        this.contentModelEditPlugin = new ContentModelEditPlugin();
        this.contentModelAutoFormatPlugin = new ContentModelAutoFormatPlugin();
        this.contentModelRibbonPlugin = new ContentModelRibbonPlugin();
        this.pasteOptionPlugin = createPasteOptionPlugin();
        this.emojiPlugin = createEmojiPlugin();
        this.mentionPlugin = new PickerPlugin(this.getPickerDataProvider(), this.getPickerOption());
        this.formatPainterPlugin = new ContentModelFormatPainterPlugin();
        this.pastePlugin = new ContentModelPastePlugin();
        this.sampleEntityPlugin = new SampleEntityPlugin();
        this.state = {
            showSidePane: window.location.hash != '',
            popoutWindow: null,
            initState: this.editorOptionPlugin.getBuildInPluginState(),
            scale: 1,
            isDarkMode: this.themeMatch?.matches || false,
            editorCreator: null,
            isRtl: false,
            tableBorderFormat: {
                width: '1px',
                style: 'solid',
                color: '#ABABAB',
            },
        };
    }

    renderMentionPicker() {
        return (
            <DefaultButton
                style={{ width: '100px', height: '100px' }}
                onClick={() => {
                    // alert('Leah Xia');
                    // const node = this.editor?.getDocument().createElement('span');
                    // // node.innerText = 'Leah Xia';
                    // node.textContent = 'Leah Xia';
                    // node.setAttribute('id', 'leah-xia');
                    // const attribute = this.editor?.getDocument().createAttribute('style');
                    // attribute.value = stringify({ color: 'red' });
                    // node.attributes.setNamedItem(attribute);
                    // node.id = 'leah-xia';

                    const anchorElement = document.createElement('span');
                    const atMentionId = 'msft-mention' + 'suggestion.id';
                    const targetName = 'Leah Xia';
                    anchorElement.id = atMentionId;
                    anchorElement.innerText = '@' + targetName;
                    this.insertElementIntoEditor(anchorElement);
                    // console.log('getContent', this.editor.getContent());
                    console.log('getContent', this.editor.getFocusedPosition());
                }}>
                Leah Xia
            </DefaultButton>
        );
    }

    getStyles(): Record<string, string> {
        return styles;
    }

    renderTitleBar() {
        return <TitleBar className={styles.noGrow} mode="contentModel" />;
    }

    renderRibbon(isPopout: boolean) {
        return (
            <ContentModelRibbon
                ribbonPlugin={this.contentModelRibbonPlugin}
                isRtl={this.state.isRtl}
                isInPopout={isPopout}
            />
        );
    }

    renderSidePane(fullWidth: boolean) {
        const styles = this.getStyles();

        return (
            <SidePane
                ref={this.sidePane}
                plugins={this.getSidePanePlugins()}
                mode="contentModel"
                className={`main-pane ${styles.sidePane} ${
                    fullWidth ? styles.sidePaneFullWidth : ''
                }`}
            />
        );
    }

    getPlugins() {
        this.toggleablePlugins =
            this.toggleablePlugins || getToggleablePlugins(this.state.initState);

        const plugins = [
            ...this.toggleablePlugins,
            this.contentModelPanePlugin.getInnerRibbonPlugin(),
            this.pasteOptionPlugin,
            this.emojiPlugin,
            this.mentionPlugin,
            this.formatPainterPlugin,
            this.sampleEntityPlugin,
        ];

        if (this.state.showSidePane || this.state.popoutWindow) {
            arrayPush(plugins, this.getSidePanePlugins());
        }

        plugins.push(this.updateContentPlugin);

        return plugins;
    }

    resetEditor() {
        this.toggleablePlugins = null;
        this.setState({
            editorCreator: (div: HTMLDivElement, options: ContentModelEditorOptions) =>
                new ContentModelEditor(div, {
                    ...options,
                    cacheModel: this.state.initState.cacheModel,
                }),
        });
    }

    renderEditor() {
        const styles = this.getStyles();
        const allPlugins = this.getPlugins();
        const editorStyles = {
            transform: `scale(${this.state.scale})`,
            transformOrigin: this.state.isRtl ? 'right top' : 'left top',
            height: `calc(${100 / this.state.scale}%)`,
            width: `calc(${100 / this.state.scale}%)`,
        };
        const format = this.state.initState.defaultFormat;
        const defaultFormat: ContentModelSegmentFormat = {
            fontWeight: format.bold ? 'bold' : undefined,
            italic: format.italic || undefined,
            underline: format.underline || undefined,
            fontFamily: format.fontFamily || undefined,
            fontSize: format.fontSize || undefined,
            textColor: format.textColors?.lightModeColor || format.textColor || undefined,
            backgroundColor:
                format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
        };

        this.updateContentPlugin.forceUpdate();

        return (
            <div className={styles.editorContainer} id="EditorContainer">
                <div style={editorStyles}>
                    {this.state.editorCreator && (
                        <ContentModelRooster
                            id={MainPaneBase.editorDivId}
                            className={styles.editor}
                            legacyPlugins={allPlugins}
                            plugins={[
                                this.contentModelRibbonPlugin,
                                this.formatPainterPlugin,
                                this.pastePlugin,
                                this.contentModelAutoFormatPlugin,
                                this.contentModelEditPlugin,
                            ]}
                            defaultSegmentFormat={defaultFormat}
                            inDarkMode={this.state.isDarkMode}
                            getDarkColor={getDarkColor}
                            experimentalFeatures={this.state.initState.experimentalFeatures}
                            snapshots={this.snapshotPlugin.getSnapshots()}
                            trustedHTMLHandler={trustedHTMLHandler}
                            zoomScale={this.state.scale}
                            initialContent={this.content}
                            editorCreator={this.state.editorCreator}
                            dir={this.state.isRtl ? 'rtl' : 'ltr'}
                        />
                    )}
                </div>
            </div>
        );
    }

    getTheme(isDark: boolean): PartialTheme {
        return isDark ? DarkTheme : LightTheme;
    }

    private getSidePanePlugins() {
        return [
            this.formatStatePlugin,
            this.editorOptionPlugin,
            this.eventViewPlugin,
            this.apiPlaygroundPlugin,
            this.snapshotPlugin,
            this.contentModelPanePlugin,
        ];
    }
}

export function mount(parent: HTMLElement) {
    ReactDOM.render(<ContentModelEditorMainPane />, parent);
}

