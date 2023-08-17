import { BaseEventData, PointerEventData, EventTrigger, EventTriggerType } from 'UnityEngine.EventSystems';
import { Entry } from 'UnityEngine.EventSystems.EventTrigger';

export default class EventHandler {
    public constructor(eventTrigger: EventTrigger) {
        eventTrigger.triggers.Add(
            this.CreateNewEvent(
                EventTriggerType.Drag, eventData => this.Ontrigger(eventData as PointerEventData)
        ));
    }

    private CreateNewEvent(type: EventTriggerType, callback: (eventData: BaseEventData) => void): Entry {
        const newEntry: Entry = new Entry();
        newEntry.eventID = type;
        newEntry.callback.AddListener(eventData => callback(eventData));
        return newEntry;
    }

    private Ontrigger(eventData: PointerEventData) {
        // Event trigger callback
        console.log(eventData);
    }
}