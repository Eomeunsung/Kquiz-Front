import React from 'react';
import "./../../css/common/Page.css"
function Page({ totalPages, currentPage, onPageChange }) {
    return (
        <div className="pagination">
            {/* 이전 버튼 */}
            <button
                className="page-button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &lt; 이전
            </button>

            {/* 페이지 번호 버튼 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={`page-button ${page === currentPage ? "active" : ""}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {/* 다음 버튼 */}
            <button
                className="page-button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                다음 &gt;
            </button>
        </div>
    );
}

export default Page;