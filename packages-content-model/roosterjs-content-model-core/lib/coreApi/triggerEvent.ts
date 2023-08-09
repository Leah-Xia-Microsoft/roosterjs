import { EditorPlugin, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { TriggerEvent } from '../coreEditor/ContentModelEditor2Core';

const allowedEventsInShadowEdit: PluginEventType[] = [
    PluginEventType.EditorReady,
    PluginEventType.BeforeDispose,
    PluginEventType.ExtractContentWithDom,
    PluginEventType.ZoomChanged,
];

/**
 * @internal
 * Trigger a plugin event
 * @param core The EditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export const triggerEvent: TriggerEvent = (core, pluginEvent, broadcast) => {
    if (
        (!core.lifecycle.shadowEditFragment ||
            allowedEventsInShadowEdit.indexOf(pluginEvent.eventType) >= 0) &&
        (broadcast || !core.plugins.some(plugin => handledExclusively(pluginEvent, plugin)))
    ) {
        core.plugins.forEach(plugin => {
            if (plugin.onPluginEvent) {
                plugin.onPluginEvent(pluginEvent);
            }
        });
    }
};

function handledExclusively(event: PluginEvent, plugin: EditorPlugin): boolean {
    if (plugin.onPluginEvent && plugin.willHandleEventExclusively?.(event)) {
        plugin.onPluginEvent(event);
        return true;
    }

    return false;
}