import React, { useEffect, useRef, useState } from 'react';
import DurationPicker from './utils/DurationPicker';
import ReminderPicker from './utils/ReminderPicker';
import Popup from './utils/Popup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

type Props = {};

type Guest = {
  Name: string;
  email: string;
  AvatarUrl: string;
};

type Attachment = {
  filename: string;
  format: string;
  file: File[];
};

type FormData = {
  EventName: string;
  Description: string;
  Date: string;
  Time: string;
  Duration: string;
  Location: string;
  Guests: Guest[];
  Notification: string;
  ReminderBefore: string;
  Attachments: Attachment[];
};

const NewEvent: React.FC<any> = ({ onCancel }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'slack'>('email');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    EventName: '',
    Description: '',
    Date: '',
    Time: '',
    Duration: '',
    Location: '',
    Guests: [],
    Notification: activeTab,
    ReminderBefore: '',
    Attachments: [{ filename: '', format: '', file: [] }],
  });
  const [newGuestEmail, setNewGuestEmail] = useState('');

  const handleGuestEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGuestEmail(e.target.value);
  };
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleAddGuest = () => {
    if (!validateEmail(newGuestEmail)) {
      setEmailError('* Invalid email format');
      return;
    }
    setEmailError(null)
    setFormData((prevData) => {
      const newGuest: Guest = { Name: '', email: newGuestEmail, AvatarUrl: '' };
      const updatedGuests = [...prevData.Guests, newGuest];
      return {
        ...prevData,
        Guests: updatedGuests,
      };
    });

    // Clear the typed email after adding the guest
    setNewGuestEmail('');
  };
  const handleDeleteFile = (file: File) => {
    setFormData((prevData) => {
      const updatedAttachments = [...prevData.Attachments];
      const updatedFiles = updatedAttachments[0].file.filter((f) => f !== file);
      
      updatedAttachments[0].file = updatedFiles;

      return {
        ...prevData,
        Attachments: updatedAttachments,
      };
    });
  };



  const handleAttachmentInputChange = (
    index: number,
    files: FileList | null
  ) => {
    setFormData((prevData) => {
      const updatedAttachments = [...prevData.Attachments];
      if (files) {
        updatedAttachments[index].file = Array.from(files);
        updatedAttachments[index].filename = files[0].name;
      } else {
        updatedAttachments[index].file = [];
        updatedAttachments[index].filename = '';
      }
      return {
        ...prevData,
        Attachments: updatedAttachments,
      };
    });
  };
  const generateRandomMeetLink = () => {
    const randomMeetingId = Math.random().toString(36).substring(7);
    const meetLink = `https://meet.google.com/${randomMeetingId}`;
    handleInputChange('Location', meetLink);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post('https://backend-rohan27s.vercel.app/api/auth/addnew', formData);
      console.log('Event posted successfully:', response.data);
      toast.success('Event posted successfully!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error('Error posting event. Please try again.', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTabClick = (tab: 'email' | 'slack') => {
    setActiveTab(tab);
    setFormData((prevData) => ({
      ...prevData,
      ['Notification']: tab,
    }));
  };

  const [isDescriptionPopupOpen, setDescriptionPopupOpen] = useState(false);
  const handleOpenDescriptionPopup = () => {
    setDescriptionPopupOpen(true);
  };
  const [emailError, setEmailError] = useState<string | null>(null);



  const validateEmail = (email: string): boolean => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleCloseDescriptionPopup = () => {
    setDescriptionPopupOpen(false);
  };
  const removeGuest = (index: number) => {
    setFormData((prevData) => {
      const updatedGuests = [...prevData.Guests];
      updatedGuests.splice(index, 1);

      return {
        ...prevData,
        Guests: updatedGuests,
      };
    });
  };
  const handleReminderChange = (selectedReminder: string) => {
    handleInputChange('ReminderBefore', selectedReminder);
  };
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

  const handleSaveDescription = () => {
    // Add logic to save description here

    // Close the popup after saving
    handleCloseDescriptionPopup();
  };
  const formatFileSize = (sizeInBytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (sizeInBytes === 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(sizeInBytes) / Math.log(1024))));
    return Math.round(sizeInBytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className='form_container'>
        <div className='event_form_header'>
          <h2>Create Event</h2>
          <span onClick={onCancel}>X</span>
        </div>
        <form onSubmit={handleSubmit}>
          <span className="input-with-button">
            <label>
              Event Name
            </label>
            <input
              type="text"
              value={formData.EventName}
              placeholder='Enter event name'
              onChange={(e) => handleInputChange('EventName', e.target.value)}
            />
            <button type="button" onClick={handleOpenDescriptionPopup}>
              Add Description
            </button>
          </span>
          <div className='single_row_data'>
            <span>
              <label>
                Date:
              </label>
              <input
                type="date"
                value={formData.Date}
                onChange={(e) => handleInputChange('Date', e.target.value)}
              />
            </span><span>
              <label>
                Time:
              </label>
              <input
                type="time"
                value={formData.Time}
                onChange={(e) => handleInputChange('Time', e.target.value)}
              />
            </span><span>
              <label>
                Duration:
              </label>
              <DurationPicker onChange={(duration) => handleInputChange('Duration', duration)} />

            </span>
          </div>
          {/* Assuming Duration is in HH:mm format */}
          {formData.Date && formData.Time && formData.Duration && (
            <p className='subtitle'>
              This event is scheduled on {formData.Date} from {formData.Time} until{' '}
              {calculateEndTime(formData.Time, formData.Duration)}
            </p>
          )}

          <span className="input-with-button">
            <label>
              Location
            </label>
            <input
              type="text"
              value={formData.Location}
              placeholder='Enter Location'
              onChange={(e) => handleInputChange('Location', e.target.value)}
            />
            <button type="button" onClick={generateRandomMeetLink}>
              Set Meeting Room
            </button>
          </span>
          <div>
            <span className="input-with-button">
              <label>
                Add Guests
              </label>
              <input
                type="email"
                placeholder='contact@example.com'
                value={newGuestEmail}
                onChange={(e) => handleGuestEmailChange(e)}
              />
              <button type="button" onClick={handleAddGuest}>
                Add
              </button>
            </span>
            <span className="input-error">{emailError}</span>

            <div className='guest_list'>

              {formData?.Guests.map((guest, index) => (
                <div className="guest_avatar">
                  <span>
                    <h3>{guest.email[0]}</h3>
                    <p onClick={() => removeGuest(index)}>X</p>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='single_row_data'>
            <span>
              <label>
                Notification
              </label>
              <span className={'notification'}>
                <p className={`${activeTab === 'email' && 'active-email'}`} onClick={() => handleTabClick('email')}>Email</p>
                <p className={`${activeTab === 'slack' && 'active-slack'}`} onClick={() => handleTabClick('slack')}>Slack</p>
              </span>
            </span><span>
              <label>
                Set Reminder
              </label>
              <ReminderPicker onReminderChange={handleReminderChange} />
            </span>
          </div>
          <div >
            <label>
              Uploaded Attachment
            </label>
            <div className='files_container'>
              <div className="upload_file">
                <button type="button" onClick={handleSelectFilesClick}>
                  Select Files
                </button>
                <input
                  type="file"
                  multiple  // Allow multiple files
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => handleAttachmentInputChange(0, e.target.files)}
                />
              </div>
              <hr />
              <div className="uploaded_files">
              {formData.Attachments[0].file.length > 0 ? (
            <ul>
              {formData.Attachments[0].file.map((file, idx) => (
                <div className='file_bar'>
                <li key={idx}>
                  <span>
                   ✔️
                    {file.name}
                  </span>
                  <p className='tag'>{formatFileSize(file.size)}</p>
                </li>
                 <button
                 type="button"
                 className="delete-file-btn"
                 onClick={() => handleDeleteFile(file)}
               >
                 ❌
               </button>
               </div>
              ))}
            </ul>
          ) : (
            <p>No Uploaded files</p>
          )}
        </div>


            </div>

          </div>
          <div className="new_event_btn_footer">
            <button type="button" className='cancel-btn' onClick={onCancel}>Cancel</button>
            <button type="submit" onClick={handleSubmit} className='create-btn'>{loading ? "Creating..." : "Create Event"}</button>
          </div>
        </form>
      </div>
      <Popup isOpen={isDescriptionPopupOpen} onClose={handleCloseDescriptionPopup}>
        <label>Description:</label>
        <div className="popup_desc">
          <textarea
            value={formData.Description}
            onChange={(e) => handleInputChange('Description', e.target.value)}
          />
          <div className='popup_footer'>
            <button onClick={handleSaveDescription}>Save</button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default NewEvent;
