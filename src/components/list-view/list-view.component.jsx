import React from "react";

import './list-view.styles.scss';

const ListView = ({children}) => {

    return (

        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    <div className="items">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListView;