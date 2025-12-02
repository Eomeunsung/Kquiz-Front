import "./../css/common/PageComponent.css"
const PageComponent = ({ serverData, movePage }) => {
    console.log("서ㅓ버 데이터 ",serverData)
    return (
        <div className="pagination-container">
            {serverData.prev && (
                <div className="page-btn" onClick={() => movePage({ page: serverData.prevPage })}>
                    Prev
                </div>
            )}

            {serverData.pageNumList.map((pageNum) => (
                <div
                    key={pageNum}
                    className={`page-btn ${serverData.current === pageNum ? "active" : ""}`}
                    onClick={() => movePage({ page: pageNum })}
                >
                    {pageNum}
                </div>
            ))}

            {serverData.next && (
                <div className="page-btn" onClick={() => movePage({ page: serverData.nextPage })}>
                    Next
                </div>
            )}
        </div>
    );
};

export default PageComponent;
