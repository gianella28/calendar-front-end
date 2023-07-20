import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from "../";
import { getMessagesES, localizer } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore  } from '../../hooks';



  //crear evento lo unico obligatorio es el title y end
 /* const events =[{
    title:'cumpleñaos del jefe',
    notes:'hay que comprar el pastel',
    start:new Date(),
    end: addHours(new Date(),2),
    bgColor: '#fafafa',
    user:{
        _id:'123',
        name:'Gianella'
    }
  }]*/

export const CalendarPage = () => {
  const { user } = useAuthStore();
  const {openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvent} = useCalendarStore();

  const [lastView, setlastView] = useState(localStorage.getItem('lastView') || 'week' )
  const eventStyleGetter=(event, dateStart, dateEnd, isSelected )=>{
    //console.log({event, start, end, isSelected});

    const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);
    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity:0.8,
      color:'white'
    }

    return{
      style
    }
  }

  const onDoubleClick=(event) =>{
    //console.log({doubleClick: event});
    openDateModal();

  }

  const onSelect=(event) =>{
    //console.log({click: event});
    setActiveEvent(event);
  }

  const onViewChanged=(event) =>{
    //console.log({viewChanged: event});
    localStorage.setItem('lastView', event);
    setlastView(event)

  }
  useEffect(() => {
    startLoadingEvent();
  }, [])
  

    return (
        <>
        <NavBar />

        <Calendar
            culture='es'
            localizer={localizer}
            events={events}
            defaultView={lastView}
            startAccessor="dateStart"
            endAccessor="dateEnd"
            style={{ height: 'calc(100vh - 80px' }}
            messages={getMessagesES()}
            eventPropGetter={eventStyleGetter}
            components={{
              event:CalendarEvent
            }}
            onDoubleClickEvent={onDoubleClick}
            onSelectEvent={onSelect}
            onView={onViewChanged}
        />

        <CalendarModal />
        <FabAddNew />
        <FabDelete />
        </>
       
      )
}
