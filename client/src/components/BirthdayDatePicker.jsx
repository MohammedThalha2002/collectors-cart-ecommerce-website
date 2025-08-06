import React from "react";

function BirthdayDatePickerDialog({ onSubmit, onCancel, onDateChange }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold">Select Birthday Date</h2>
        <p className="text-gray-600 mb-4 text-sm">
          This note has a unique serial number that matches your birthday — a
          rare and meaningful collectible. To confirm, please select your
          birthdate:
        </p>
        <input
          type="date"
          required={true}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit();
            }}
            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
          >
            Confirm & Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default BirthdayDatePickerDialog;
