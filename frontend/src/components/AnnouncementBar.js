import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-white h-9 sm:h-10 overflow-hidden relative flex items-center">
      <div className="marquee-container w-full">
        <div className="marquee-content">
          <span className="marquee-item text-xs sm:text-sm font-medium tracking-wide">
            Limited Filing Slots Available Today &nbsp;&bull;&nbsp; Trademark Registration ₹1,299 + Govt Fee &nbsp;&bull;&nbsp; Secure Your Brand Before Someone Else Does &nbsp;&bull;&nbsp; 1000+ Brands Protected &nbsp;&bull;&nbsp;
          </span>
          <span className="marquee-item text-xs sm:text-sm font-medium tracking-wide">
            Limited Filing Slots Available Today &nbsp;&bull;&nbsp; Trademark Registration ₹1,299 + Govt Fee &nbsp;&bull;&nbsp; Secure Your Brand Before Someone Else Does &nbsp;&bull;&nbsp; 1000+ Brands Protected &nbsp;&bull;&nbsp;
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;