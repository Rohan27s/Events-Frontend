import React, { useEffect, useRef, useState } from 'react';

type Props = {};

const ReminderPicker = (props: { onReminderChange: (selectedReminder: string) => void }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedReminder(selectedValue);
    setDropdownOpen(false);
    props.onReminderChange(selectedValue);
  };

  const handleClick = () => {
    setDropdownOpen(true);
  };

  const handleBlur = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const reminderOptions = [
    { value: '-30', label: '30 min before the event' },
    { value: '60', label: '1 hour before the event' },
    { value: '1440', label: '1 day before the event' },
    { value: '2880', label: '2 days before the event' },
  ];

  return (
    <div ref={containerRef} className={`reminder_dropdown ${isDropdownOpen ? 'open' : ''}`}>
      <select
        id="reminder"
        value={selectedReminder}
        onChange={handleSelectChange}
        onBlur={handleBlur}
      >
        <option value="" disabled>
          Select Reminder
        </option>
        {reminderOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReminderPicker;
