import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
    
    const dispatch = useDispatch();
    const {events, activeEvent} = useSelector(state => state.calendar);
    const { user } = useSelector( state => state.auth);

    const setActiveEvent = (calendarEvent)=>{
        dispatch( onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async(calendarEvent) => {
        //TODO: llega al backend
        try {
            if(calendarEvent.id){
                //actualizando
                await calendarApi.put(`/events/${ calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({...calendarEvent, user}));
                return;                
            }

            //creando
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({...calendarEvent, id:data.evento.id, user }));
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }        
    }

    const startDeletingEvent = async() => {
        //Todo: llegar al backend
        try {
            await calendarApi.delete(`/events/${ activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');  
        } 
    }

    const startLoadingEvent = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            console.log({data});
            const events = convertEventsToDateEvents(data.eventos);
            dispatch(onLoadEvents(events) );
            console.log({events})

        } catch (error) {
            console.log('error cargando eventos');
            console.log(error)
        }
    }

    return {
        //propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        
        //metodos
        startDeletingEvent,
        setActiveEvent,
        startLoadingEvent,
        startSavingEvent,
        

    }
  
}
