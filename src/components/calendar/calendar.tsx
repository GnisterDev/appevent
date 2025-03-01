

  const EVENTS = [
    
    {title: "Arr1", date: "20.03.2025", rolle: "i"} ,
    {title: "Arr2", date: "20.03.2025", rolle: "i"} ,
    {title: "Arr3", date: "14.03.2025", rolle: "d"} ,
    {title: "Arr4", date: "28.03.2025", rolle: "a"} ,
    {title: "Arr5", date: "17.04.2025", rolle: "d"}
  ];
  

  function EventList({events}) {
    return (
      <div>
        <h1>"Liste over dine arrangementer</h1>
        <EventListByRolle events={events} />
        <EventListByRolle events={events}/>
        <EventListByRolle events={events}/>
      </div>
    );
  }

  function EventListByRolle({events}) {
   
    return (
      <div>
        <h3>"På disse arrangementene er du... "</h3>
        <div>
          <EventRow/>
        </div>
      </div>
    );
  }
  function EventRow( ) {
    return (
     <div>
      "test"
     </div>
    );
  }

  export default  EventList;
  
  