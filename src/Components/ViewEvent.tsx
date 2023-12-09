import React from 'react';

type Props = {
  onCancel: () => void;
  eventDetails: {
    EventName: string;
    Description: string;
    Date: string;
    Time: string;
    Duration: string;
    Location: string;
    Guests: { Name: string; email: string; AvatarUrl: string }[];
    Notification: string;
    ReminderBefore: string;
    Attachments: { filename: string; format: string; file: File | null }[];
  };
};

const ViewEvent: React.FC<Props> = ({ onCancel, eventDetails }) => {
  const calculateEndTime = (startTime: string, duration: string): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);

    const durationMatch = duration.match(/(\d+)h (\d+)m/);

    if (durationMatch) {
      const [, durationHours, durationMinutes] = durationMatch.map(Number);

      let endHour = startHour + durationHours;
      let endMinute = startMinute + durationMinutes;

      // Adjust for overflow
      if (endMinute >= 60) {
        endHour += Math.floor(endMinute / 60);
        endMinute %= 60;
      }

      return `${padZero(endHour)}:${padZero(endMinute)}`;
    }

    return '....';
  };

  const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);
  return (
    <>
            <div className='form_container'>

        <div className='event_form_header'>
          <h2>Event Details</h2>
          <span onClick={onCancel}>X</span>
        </div>
        <form>
          <div className="input-with-button">
            <label>Event Name</label>
            <input type="text" value={eventDetails.EventName} readOnly />
          </div>
          <div className='single_row_data'>
            <span>
              <label>Date:</label>
              <input type="date" value={eventDetails.Date} readOnly />
            </span>
            <span>
              <label>Time:</label>
              <input type="time" value={eventDetails.Time} readOnly />
            </span>
            <span>
              <label>Duration:</label>
              <input type="text" value={eventDetails.Duration} readOnly />
            </span>
          </div>
          {eventDetails.Date && eventDetails.Time && eventDetails.Duration && (
            <p className='subtitle'>
              This event is scheduled on {eventDetails.Date} from {eventDetails.Time} until{' '}
              {calculateEndTime(eventDetails.Time, eventDetails.Duration)}
            </p>
          )}
          <div className="input-with-button">
            <label>Location</label>
            <input type="text" value={eventDetails.Location} readOnly />
          </div>
          <div>
            <div className="input-with-button">
              <label> Guest List</label>
            <div className='guest_list'>

              {eventDetails.Guests.map((guest, index) => (
                <div key={index} className="guest_avatar">
                  <span>
                    <h3>{guest.email[0]}</h3>
                  </span>
                </div>
              ))}
              </div>
            </div>
          </div>
          <div className='single_row_data'>
            <span>
              <label>Notification</label>
              <span className={'notification'}>
                <p>{eventDetails.Notification}</p>
              </span>
            </span>
          </div>
          <div>
            
          </div>
        </form>
      </div>
    </>
  );
};

export default ViewEvent;
