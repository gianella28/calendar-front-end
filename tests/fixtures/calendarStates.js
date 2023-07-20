

export const events =[
    {
        id:'1',
        dateStart: new Date('2023-07-21 13:00:00'),
        dateEnd: new Date('2023-07-21 15:00:00'),
        title:'cumpleaños de toño',
        notes:'llevar pastel'
    },
    {
        id:'2',
        dateStart: new Date('2023-07-23 13:00:00'),
        dateEnd: new Date('2023-07-23 15:00:00'),
        title:'cumpleaños de melissa',
        notes:'llevar pastel'
    },
    {
        id:'3',
        dateStart: new Date('2023-07-25 13:00:00'),
        dateEnd: new Date('2023-07-25 15:00:00'),
        title:'cumpleaños de fernadno',
        notes:'llevar pastel rojo'
    },
];

export const initialState = {
    isLoadingEvents:true,
    events:[],
    activeEvent:null
}

export const calendarWithEventsState = {
    isLoadingEvents:false,
    events:[...events],
    activeEvent:null
}

export const calendarWithActiveEventState = {
    isLoadingEvents:false,
    events:[...events],
    activeEvent:{...events[0]}
}
    
