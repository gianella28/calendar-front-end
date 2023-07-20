import { parseISO } from "date-fns";


export const convertEventsToDateEvents = (events = []) => {
    return events.map( event => {
        event.dateStart = parseISO(event.dateStart);
        event.dateEnd = parseISO(event.dateEnd);
        return event;
    })
}