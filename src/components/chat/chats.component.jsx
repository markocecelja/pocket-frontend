import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import ListItem from "../list-view/list-item/list-item.component";
import { ReactComponent as ChatIcon } from "../../assets/chat.svg"
import ListView from "../list-view/list-view.component";
import { getChats } from "../../redux/chat/chat.selectors";

import { selectCurrentUser } from "../../redux/user/user.selectors";

const Chats = ({ chats, currentUser, withPostInfo, ...props }) => {

    return (
        <ListView pageCount={chats.totalPages} {...props}>
            {chats.content.map(chat =>
                <ListItem onClick={() => props.history.push(`/chats/${chat.id}`)} clickable={true} cover={<ChatIcon />}>
                    <h5>{ withPostInfo ? `${chat.post.title} - ${chat.user.firstName} ${chat.user.lastName}` : `${chat.user.firstName} ${chat.user.lastName}`}</h5>
                </ListItem>
            )}
        </ListView>
    );
}

const mapStateToProps = createStructuredSelector({
    chats: getChats,
    currentUser: selectCurrentUser
});

export default withRouter(connect(mapStateToProps)(Chats));