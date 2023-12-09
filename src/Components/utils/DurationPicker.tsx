import React, { useEffect, useRef, useState } from 'react'

type Props = {
    onChange: (duration: string) => void;
};


const DurationPicker: React.FC<Props> = ({ onChange }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedHours, setSelectedHours] = useState<string>('');
    const [selectedMinutes, setSelectedMinutes] = useState<string>('');

    const containerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
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

    useEffect(() => {
        const duration = `${selectedHours}h ${selectedMinutes}m`;
        onChange(duration);
    }, [selectedHours, selectedMinutes, onChange]);

    return (
        <div ref={containerRef} className={`duration_dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <select
                id="hours"
                onChange={(e) => setSelectedHours(e.target.value)}
                onClick={toggleDropdown}
                onBlur={handleBlur}
            >
                <option value="">Hours</option>
                {Array.from({ length: 24 }).map((_, hour) => (
                    <option key={hour} value={`${hour}`}>
                        {`${hour}h`}
                    </option>
                ))}
            </select>
            <select
                id="minutes"
                onChange={(e) => setSelectedMinutes(e.target.value)}
                onClick={toggleDropdown}
                onBlur={handleBlur}
            >
                <option value="">Minutes</option>
                {Array.from({ length: 60 }).map((_, minute) => (
                    <option key={minute} value={`${minute}`}>
                        {`${minute}m`}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DurationPicker;