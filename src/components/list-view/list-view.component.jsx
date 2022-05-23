import React from "react";
import ReactPaginate from "react-paginate";

import './list-view.styles.scss';

const ListView = ({ children, pageCount, handlePageChanged }) => {

    return (

        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    <div className="items">
                        {children}
                    </div>
                </div>
            </div>
            {pageCount > 0 &&
                <ReactPaginate
                    previousLabel="Prethodna"
                    nextLabel="Sljedeća"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChanged}
                    containerClassName="pagination"
                    activeClassName="active"
                />
            }
        </div>
    );
}

export default ListView;