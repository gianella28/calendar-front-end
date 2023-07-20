import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates"

describe('Pruebas en calendarSlice', ()=>{
    test('debe de regresar el estado por defecto', () => { 
        const state= calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
    })

    test('onSetActiveEvent debe de activar el evento', () => { 
        const state= calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        expect(state.activeEvent).toEqual(events[0]);
    })

    test('onAddNewEvent debe de agregar el evento', () => { 
        const newEvent={
            id:'3',
            dateStart: new Date('2023-07-25 13:00:00'),
            dateEnd: new Date('2023-07-25 15:00:00'),
            title:'cumpleaños de fernadno 5',
            notes:'llevar pastel rojo'
        }
        const state= calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));
        expect(state.events).toEqual([...events, newEvent]);
    })

    test('onUpdateEvent debe de actualizar el evento', () => { 
        const updateEvent={
            id:'1',
            dateStart: new Date('2022-07-25 13:00:00'),
            dateEnd: new Date('2022-07-25 15:00:00'),
            title:'cumpleaños de fernadno actualizado',
            notes:'llevar pastel rojo'
        }
        const state= calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updateEvent));
        expect(state.events).toContain(updateEvent);
    })

    test('onDeleteEvent debe de borrar el evento activo', () => { 
        const state= calendarSlice.reducer(calendarWithEventsState, onDeleteEvent());
        expect(state.activeEvent).toBe(null);
        expect(state.events).toContainEqual(events[0]);
    })

   test('onLoadEvents debe de establecer los eventos', () => { 
        const state= calendarSlice.reducer(initialState, onLoadEvents(events));
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toEqual(events);

        const newState = calendarSlice.reducer(state, onLoadEvents(events));
        expect(newState.events.length).toBe(events.length);
    })

    test('onLogoutCalendar debe de limpiar el estado', () => { 
        const state= calendarSlice.reducer(calendarWithEventsState, onLogoutCalendar());
        expect(state).toEqual(initialState);
    })
})