import React from 'react';

interface CellProps {
  alive: boolean;
}

const Cell: React.FC<CellProps> = ({ alive }) => {
  return (
    <div
      className={`h-5 w-5 border border-gray-200 ${
        alive ? 'bg-slate-800' : 'bg-gray-50/30'
      }`}
    ></div>
  );
};

export default Cell;
