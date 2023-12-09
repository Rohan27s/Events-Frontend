import React, { ReactNode, useState } from 'react';

type PopupProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
    return (
        <>
            {isOpen && (
                <div className="popup-overlay" onClick={onClose}>
                    <div className="popup-container" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={onClose}>
                            X
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Popup;
