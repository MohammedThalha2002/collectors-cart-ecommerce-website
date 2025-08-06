function AnnouncementBanner({ content }) {
  return (
    <div className="flex bg-maroon justify-center w-full p-2 items-center text-sm text-center font-normal text-white z-[100] font-poppins">
      <p>{content}</p>
    </div>
  );
}

export default AnnouncementBanner;
