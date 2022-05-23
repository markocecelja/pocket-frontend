import React from "react";

const ListItem = ({ children, cover, clickable, ...props }) => {

    return (

        <div className={`item${clickable ? " clickable" : ""}`} {...props}>
            <div className="row">
                <div className="col-md-2 col-sm-2">
                    {cover}
                </div>
                <div className="col-md-7 col-sm-7">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ListItem;