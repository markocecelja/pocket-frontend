import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import ListItem from "../list-view/list-item/list-item.component";
import { ReactComponent as ChatIcon } from "../../assets/chat.svg"
import ListView from "../list-view/list-view.component";
import { getChats } from "../../redux/chat/chat.selectors";

const Chats = ({ chats, ...props }) => {

    return (
        <ListView pageCount={chats.totalPages} {...props}>
            {chats.content.map(chat =>
                <ListItem onClick={() => props.history.push(`/chats/${chat.id}`)} clickable={true} cover={<ChatIcon />}>
                    <h5>{`${chat.user.firstName} ${chat.user.lastName}`}</h5>
                </ListItem>
            )}
        </ListView>
    );
}

const mapStateToProps = createStructuredSelector({
    chats: getChats
});

export default withRouter(connect(mapStateToProps)(Chats));