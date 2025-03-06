
import React from "react";

  const EVENTS = [
    
    {title: "Arr1", date: "20.03.2025", rolle: "invitert"} ,
    {title: "Arr2", date: "20.03.2025", rolle: "invitert"} ,
    {title: "Arr3", date: "14.03.2025", rolle: "påmeldt"} ,
    {title: "Arr4", date: "28.03.2025", rolle: "arrangør"} ,
    {title: "Arr5", date: "17.04.2025", rolle: "påmeldt"}
  ];
  

  function EventList({events}) {
    return (
      <div>
        <h1>Liste over dine arrangementer</h1>
        <EventListByRolle events={events}  rolle={"arrangør"} />
        <EventListByRolle events={events}  rolle={"påmeldt"}/>
        <EventListByRolle events={events}  rolle={"invitert"}/>
      </div>
    );
  }

  function EventListByRolle({events ,rolle}) {
    const rows = [];
   
    for (const event of events) {
      if(event.rolle == rolle){
        rows.push(
        <EventRow
        event={event}/>
      );
      }
    }  
    
    return (
      <div>
        <h3>På disse arrangementene er du {rolle} :</h3>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
  function EventRow( {event}) {
    return (
     <tr>
      <td>{event.date}</td>
      <td>{event.title}</td>
     </tr>
    );
  }

  export default  EventList;
  
  