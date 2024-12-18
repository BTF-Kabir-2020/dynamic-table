// components/ExportButtons.tsx
import React from "react";

type ExportButtonsProps = {
  sortedData: any[];
  exportToJson: (data: any[]) => void;
  exportToCsv: (data: any[]) => void;
  exportToXlsx: (data: any[]) => void;
};

const ExportButtons: React.FC<ExportButtonsProps> = ({
  sortedData,
  exportToJson,
  exportToCsv,
  exportToXlsx,
}) => {
  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={() => exportToJson(sortedData)}
        className="px-4 py-2 rounded-md shadow-md bg-blue-500 hover:bg-blue-600 text-white"
      >
        Export to JSON
      </button>
      <button
        onClick={() => exportToCsv(sortedData)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
      >
        Export to CSV
      </button>
      <button
        onClick={() => exportToXlsx(sortedData)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
      >
        Export to XLSX
      </button>
    </div>
  );
};

export default ExportButtons;
