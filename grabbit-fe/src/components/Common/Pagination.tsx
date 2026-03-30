import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-12 h-12 flex items-center justify-center border-4 border-black font-oswald text-lg transition-all duration-300 ${
              currentPage === i
                ? "bg-winterella-red text-white"
                : "bg-white text-black hover:bg-winterella-off-white"
            }`}
          >
            {i}
          </button>
        );
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-12 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-6 h-12 flex items-center justify-center border-4 border-black font-oswald uppercase tracking-widest text-sm transition-all duration-300 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-winterella-red cursor-pointer"
        }`}
      >
        Prev
      </button>

      <div className="flex space-x-2">
          {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-6 h-12 flex items-center justify-center border-4 border-black font-oswald uppercase tracking-widest text-sm transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-winterella-red cursor-pointer"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
