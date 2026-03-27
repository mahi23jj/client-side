import React, { useState } from "react";

interface ReportShopModalProps {
  shopName: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function ReportShopModal({ shopName, onClose, onSubmit }: ReportShopModalProps) {
  const [selectedReason, setSelectedReason] = useState("Inappropriate Content");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 border border-gray-300 shadow-lg">
        <h2 className="text-lg mb-4">Report {shopName}</h2>

        <label className="block mb-2">Reason</label>
        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="Inappropriate Content">Inappropriate Content</option>
          <option value="Spam or Scam">Spam or Scam</option>
          <option value="Harassment or Bullying">Harassment or Bullying</option>
          <option value="Intellectual Property Violation">Intellectual Property Violation</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(selectedReason)}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
