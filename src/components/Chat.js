import React from "react";
import Button from '@material-ui/core/Button';

import Container from '@material-ui/core/Container';
import { setToken } from "../utils";
import ToastMessage from "./ToastMessage";
import Talk from "talkjs";
import { initialize,getSession,getMe,getOperator,getStone,getPromise } from "../utils/talk";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://ec2-18-223-187-192.us-east-2.compute.amazonaws.com:1337";
const strapi = new Strapi(apiUrl);

class Chat extends React.Component {

    

  render() {

    //const chatbox = Talk.Chatbox;

    const styles = {

        div : {
          heigth: '800px'
        }
      }

    getPromise()
    .then(talkSession => {
        console.log("JSONLS :"+JSON.stringify(talkSession))

        var me = new Talk.User({
            // must be any value that uniquely identifies this user
            id: "123456",
            name: "George Looney",
            email: "george@looney.net",
            photoUrl: "https://talkjs.com/docs/img/george.jpg"
        });
        
    var operator = new Talk.User({
        // just hardcode any user id, as long as your real users don't have this id
        id: "myapp_operator",
        name: "ExampleApp Operator",
        email: "support@example.com",
        photoUrl: "http://dmssolutions.nl/wp-content/uploads/2013/06/helpdesk.png",
        welcomeMessage: "Hi there! How can I help you?"
    });

    var conversation = talkSession.getOrCreateConversation("item_2493");
    conversation.setParticipant(me);
    conversation.setParticipant(operator);
    var chatbox = talkSession.createChatbox(conversation);
            chatbox.mount(document.getElementById("talkjs-container"));
    })
    .catch(error => console.error("Megafail :"+ error));





    /*



    var operator = new Talk.User({
        // just hardcode any user id, as long as your real users don't have this id
        id: "myapp_operator",
        name: "ExampleApp Operator",
        email: "support@example.com",
        photoUrl: "http://dmssolutions.nl/wp-content/uploads/2013/06/helpdesk.png",
        welcomeMessage: "Hi there! How can I help you?"
    });

    var conversation = window.talkSession.getOrCreateConversation("item_2493");
    conversation.setParticipant(me);
    conversation.setParticipant(operator);

    var chatbox = window.talkSession.createChatbox(conversation);
    chatbox.mount(document.getElementById("talkjs-container"));
*/
    return (


      <Container >
            <div id="talkjs-container" style={{height: '400px', paddingLeft: '20px',paddingTop:'30px'}}  />

      </Container>
    );
  }
}

export default Chat;
