import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ pagination, onPageChange }) {
    const { current_page, last_page, total, from, to } = pagination || {};

    if (!total || total === 0) return null;

    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 5;

        if (last_page <= maxVisible) {
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            if (current_page <= 3) {
                for (let i = 1; i <= 3; i++) {
                    pages.push(i);
                }
                if (last_page > 4) pages.push('...');
                pages.push(last_page);
            } else if (current_page >= last_page - 2) {
                pages.push(1);
                if (last_page > 4) pages.push('...');
                for (let i = last_page - 2; i <= last_page; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = current_page - 1; i <= current_page + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(last_page);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div className="text-sm font-medium text-[#785D4E] order-2 sm:order-1">
                Affichage de {from} à {to} sur {total} produit{total !== 1 ? 's' : ''}
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1}
                    className={`
                        flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-xl
                        transition-colors duration-200
                        ${
                            current_page === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-[#4A3B32] hover:text-[#C2591A] hover:bg-[#FFF0E5]'
                        }
                    `}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                </button>

                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-3 py-2 text-sm text-[#785D4E]"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`
                                    px-3 py-2 text-sm font-semibold rounded-xl
                                    transition-colors duration-200
                                    ${
                                        current_page === page
                                            ? 'bg-[#C2591A] text-white shadow-sm'
                                            : 'text-[#4A3B32] hover:text-[#C2591A] hover:bg-[#FFF0E5]'
                                    }
                                `}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page}
                    className={`
                        flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-xl
                        transition-colors duration-200
                        ${
                            current_page === last_page
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-[#4A3B32] hover:text-[#C2591A] hover:bg-[#FFF0E5]'
                        }
                    `}
                >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="text-sm text-[#785D4E] sm:hidden order-3">
                Page {current_page} sur {last_page}
            </div>
        </div>
    );
}

export default Pagination;