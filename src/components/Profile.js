import React from "react";

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

import CssBaseline from '@material-ui/core/CssBaseline';

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ButtonBase from '@material-ui/core/ButtonBase'


import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://ec2-18-223-187-192.us-east-2.compute.amazonaws.com:1337";
const strapi = new Strapi(apiUrl);

class Profile extends React.Component {
    state = {
        user: {}
      };
    
      
      async componentDidMount() {
        try {
    
          let idUser = localStorage.getItem("user_id") 
          const response = await strapi.request("POST", "/graphql", {
            data: {
              query: `query{
                user(id: ${idUser}) {
                    id
                    username
                    email

                  }
                  }`
            }
          });
          console.log("USR "+ JSON.stringify(response));
          this.setState({ user: response.data.user });
        } catch (err) {
          console.error(err);
          
        }
      }
    
    

  render() {

    const { user} = this.state;

    const paperStyle = {
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: '16px',
        margin: 'auto',
        maxWidth: 500,
      },
      image: {
        width: '170px'
      },
      img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '170px'
      },
    }

  

    return (

        <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
  
          <Paper className={paperStyle.paper} style={{paddingTop: "10px"}}>
            <Grid container spacing={2}  xs={12}>
              <Grid item xs={6}>
                <ButtonBase className={paperStyle.image}>
                  <img style={{width: "170px"}} alt="" src="" />
                </ButtonBase>
              </Grid>
              <Grid item xs={6} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1">
                    {user.username}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                    {user.email}
                    </Typography>
                  </Grid>

                </Grid>
  
              </Grid>
            </Grid>
          </Paper>
  
  
        </Container>
        </React.Fragment>


    );
  }
}

export default Profile;
