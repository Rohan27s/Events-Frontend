import React, { useEffect, useState } from 'react';
import NewEvent from '../Components/NewEvent';
import ViewEvent from '../Components/ViewEvent';

type Props = {};

const Events: React.FC<Props> = () => {
  const [selectedComponent, setselectedComponent]: any = useState(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      setloading(true);
      try {
        const response = await fetch('https://backend-rohan27s.vercel.app/api/auth/allevent');
        const data = await response.json();
        setEvents(data);
        setloading(false)
      } catch (error) {
        console.error('Error fetching events:', error);
        setloading(false)

      }
    };

    fetchEvents();
  }, []);

  const handleCancelCreateEvent = () => {
    setselectedComponent(null);
    setSelectedEvent(null); // Reset selected event when canceling
  };

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setselectedComponent('view'); // Set selectedComponent to 'view' when viewing an event
  };

  return (
    <>
      {selectedComponent === null && (
        <>
          <div className="event-btns">
            <button onClick={() => setselectedComponent('create')}>Create an Event +</button>
          </div>
          <section className="event-cards">
            {loading&& <h2>Hold on! Events are loading..✨</h2> }
            {!loading && events?.map((event, index) => (
              <div key={index} className="event-card">
                <h3>{event.EventName}</h3>
                <p>About: {event.Description}</p>
                <p>Date: {event.Date}</p>
                <p>Time: {event.Time}</p>
                <p>Location: {event.Location}</p>
                <button className="primary-btn" onClick={() => handleViewEvent(event)}>
                  View
                </button>
              </div>
            ))}
          </section>
        </>
      )}
      {selectedComponent === 'create' && (
        <section>
          <NewEvent onCancel={handleCancelCreateEvent} />
        </section>
      )}
      {selectedComponent === 'view' && selectedEvent && (
        <section>
          <ViewEvent onCancel={handleCancelCreateEvent} eventDetails={selectedEvent} />
        </section>
      )}
    </>
  );
};

export default Events;
