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

  async componentDidMount() {
    const { match: { params } } = this.props;

    try{
        const response = await strapi.request("POST", "/graphql", {
          data: {
            query: `query {
              comerciante(id: "${params.userId}") {
                id,
                name
              }
            }`
          }
        });
        console.log("XXX "+ JSON.stringify(response));
        this.setState({ comerciante: response.data.comerciante});
      } catch (err) {
        console.error(err);
        
      }

  }

    
  render() {


    const styles = {

        div : {
          heigth: '800px'
        }
      }

    let idCliente = localStorage.getItem("user_id")

    getPromise()
    .then(talkSession => {

        var me = new Talk.User({
            // must be any value that uniquely identifies this user
            id: idCliente,
            name: "Pitu",
            email: "george@pitu.net",
            photoUrl: "https://talkjs.com/docs/img/george.jpg"
        });
        
    var operator = new Talk.User({
        // just hardcode any user id, as long as your real users don't have this id
        id: this.state.comerciante.id,
        name: "Pedido #4356",
        email: "support@justoahora.com",
        photoUrl: "http://dmssolutions.nl/wp-content/uploads/2013/06/helpdesk.png",
        welcomeMessage: "Hi there! How can I help you?"
    });

    var conversation = talkSession.getOrCreateConversation("merchant_"+ this.state.comerciante.id);
    conversation.setParticipant(me);
    conversation.setParticipant(operator);
    var chatbox = talkSession.createChatbox(conversation);
            chatbox.mount(document.getElementById("talkjs-container"));
    })
    .catch(error => console.error("Megafail :"+ error));






    return (


      <Container >
            <div id="talkjs-container" style={{height: '400px', paddingLeft: '20px',paddingTop:'30px'}}  />

      </Container>
    );
  }
}

export default Chat;
