import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { withRouter } from "react-router-dom";

import Card from "../card/card.component";

import { getChat } from "../../redux/chat/chat.selectors";
import { setChat, setChatMessages } from "../../redux/chat/chat.actions";
import { performRequest } from "../../utils/rest-util";
import FormInput from "../form-input/form-input.component";

import './chat-page.styles.scss'
import { Environments } from "../../enums/Environment";
import SockJsClient from 'react-stomp';
import Moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

class ChatPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            messages: []
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value })
    }

    handleSubmit = async event => {

        event.preventDefault();

        const { message } = this.state;
        const { chat } = this.props;

        const body = {
            text: message,
            chat: chat
        }

        await performRequest(`/api/messages`, 'post', body);

        this.setState({ message: '' })
    }

    onConnected = () => {
        console.log("Connected!!")
    }

    onMessageReceived = async (msg) => {

        const { setChatMessages } = this.props;

        let { id } = this.props.match.params;

        const messagesResponse = await performRequest(`/api/messages?chatId=${id}&size=4`, 'get', null);
        setChatMessages(messagesResponse ? messagesResponse.payload : { content: [] });
        this.setState({ messages: messagesResponse ? messagesResponse.payload.content : [] });
    }

    fetchMoreData = async () => {

        let { id } = this.props.match.params;

        const { chat, setChatMessages } = this.props;

        const messagesResponse = await performRequest(`/api/messages?chatId=${id}&size=4&page=${chat.messages.pageable.pageNumber + 1}`, 'get', null);
        setChatMessages(messagesResponse ? messagesResponse.payload : { content: [] });
        this.setState({ messages: this.state.messages.concat(messagesResponse ? messagesResponse.payload.content : []) });
    }

    async componentDidMount() {
        const { setChat, setChatMessages } = this.props;

        let { id } = this.props.match.params;

        const chatResponse = await performRequest(`/api/chats/${id}`, 'get', null);
        setChat(chatResponse ? chatResponse.payload : null);

        const messagesResponse = await performRequest(`/api/messages?chatId=${id}&size=4`, 'get', null);
        setChatMessages(messagesResponse ? messagesResponse.payload : { content: [] });
        this.setState({ messages: messagesResponse ? messagesResponse.payload.content : [] });
    }

    render() {

        const { chat } = this.props;
        const { messages } = this.state;

        Moment.locale('hr');

        return (
            <>
                {messages.length != 0 &&
                    <div className="chat">
                        <Card>
                            <section id="scrollableMessages" className="messages" style={{ height: 300, overflow: "auto", display: "flex", flexDirection: "column-reverse" }}>
                                <InfiniteScroll
                                    dataLength={messages.length}
                                    next={this.fetchMoreData}
                                    hasMore={chat.messages.pageable.pageNumber + 1 <= chat.messages.totalPages}
                                    loader={<h4>Učitavanje...</h4>}
                                    endMessage={
                                        <p style={{ textAlign: "center" }}>
                                            <b>Došli ste do kraja!</b>
                                        </p>
                                    }
                                    inverse={true}
                                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                                    scrollableTarget="scrollableMessages"
                                >
                                    {messages.map(message =>
                                        <div className={message.createdByCurrentUser ? "msg msg--right" : "msg msg--left"}>
                                            <blockquote>
                                                {message.text}
                                                <div className="date">{Moment(message.createdDateTime).format('DD.MM.YYYY. HH:mm:ss')}</div>
                                            </blockquote>
                                        </div>
                                    )}
                                </InfiniteScroll>
                            </section>
                            <form className="message-form" onSubmit={this.handleSubmit}>
                                <FormInput name="message" type="text" value={this.state.message} handleChange={this.handleChange} required label="Poruka... Za slanje pritisnite enter" />
                                <button hidden type="submit" className="btn btn-primary" />
                            </form>
                        </Card>
                    </div>
                }
                <SockJsClient
                    url={`${Environments.LOCAL}/chat`}
                    topics={['/topic/messages']}
                    onConnected={this.onConnected}
                    onDisconnect={console.log("Disconnected!")}
                    onMessage={msg => this.onMessageReceived(msg)}
                    debug={false}
                />
            </>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    chat: getChat,
});

const mapDispatchToProps = dispatch => ({
    setChat: chat => dispatch(setChat(chat)),
    setChatMessages: messages => dispatch(setChatMessages(messages))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatPage));