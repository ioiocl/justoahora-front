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

class Inbox extends React.Component {

    

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

        let me = new Talk.User({
            // must be any value that uniquely identifies this user
            id: "123456",
            name: "Pitu",
            email: "george@pitu.net",
            photoUrl: "https://i0.pngocean.com/files/281/279/792/pepe-the-frog-batman-internet-meme-pepe-frog.jpg"
        });
        let inbox = talkSession.createInbox();
        inbox.mount(document.getElementById("talkjs-container"))

    })
    .catch(error => console.error("Megafail :"+ error));

    return (


      <Container >
            <div id="talkjs-container" style={{height: '400px', paddingLeft: '20px',paddingTop:'30px'}}  />

      </Container>
    );
  }
}

export default Inbox;
