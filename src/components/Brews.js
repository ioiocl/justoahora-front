import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
// prettier-ignore

import { calculatePrice, setCart, getCart } from "../utils";
import { Box, Heading, Text, Image, Mask } from "gestalt";
import { Link } from "react-router-dom";
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';

import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatIcon from '@material-ui/icons/Forum';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Icon from '@material-ui/core/Icon';
//import Carousel from 'react-material-ui-carousel'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ButtonBase from '@material-ui/core/ButtonBase'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Divider from '@material-ui/core/Divider';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import CartIcon from '@material-ui/icons/ShoppingBasket';
import ChatToMerchant from '@material-ui/icons/Chat';
import PersonIcon from '@material-ui/icons/Person';



import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';



const apiUrl = process.env.API_URL || "http://ec2-18-223-187-192.us-east-2.compute.amazonaws.com:1337";
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brews: [],
    brand: "",
    merchantImage : "",
    cartItems: [],
    expanded: false,
    description:""
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
          comerciante(id: "${this.props.match.params.brandId}") {
            _id
            name
            description
            image {
              url
            }
            productos {
              _id
              name
              description
              image {
                url
              }
              price
            }
          }
        }`
        }
      });

      console.log("DATA "+ JSON.stringify(response.data.comerciante.image.url))

      this.setState({
        brews: response.data.comerciante.productos,
        brand: response.data.comerciante,
        merchantImage : response.data.comerciante.image.url,
        description: response.data.comerciante.description,
        cartItems: getCart()
      });
    } catch (err) {
      console.error(err);
    }
  }

  addToCart = brew => {
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === brew._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1
      });
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCart = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(
      item => item._id !== itemToDeleteId
    );
    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };





  render() {
    const { brand, brews, cartItems, description,  merchantImage} = this.state;

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

    const cardStyle = {
      root: {
        display: 'block',
        width: '30vw',
        transitionDuration: '0.3s',
        height: '25vw'
      },
      media: {
        width: '90%', 
      },
      div : {
        width: '90%'
      }
    }

    const carrouselStyle = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#424242',
      },
      gridList: {
       
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',

      },
      title: {
        color: '#4791db',
      },
      titleBar: {
        background:
          'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
      },
    }

    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
      }
    };

    const bottomNav = {
      root: {
        width: 500,
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
                <img style={{width: "170px"}} alt="complex" src={`${apiUrl}${merchantImage}`} />
              </ButtonBase>
            </Grid>
            <Grid item xs={6} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                  {brand.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                  {brand.description}
                  </Typography>
                </Grid>
                <Grid item  style={{alignContent: 'center'}}>
                  <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  <Link to={{ pathname: `/chat/${this.props.match.params.brandId}`}}>
                  <BottomNavigationAction label="Chats" icon={<ChatToMerchant />}   />
                  </Link>
                  </Typography>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Paper>


      </Container>

      <br/>

      <Container maxWidth="lg">

          <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={this.props.deviceType !== "mobile" ? false : false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={[]}
            deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            
          >



          {brews.map((tile) => (
                <div  style={cardStyle.div} >
                  <Card className={cardStyle.root}  >
                    <CardActionArea>

                      <CardMedia title="Title" alignItems="center" >
                        <img src={`${apiUrl}${tile.image.url}`} className={cardStyle.media} style={{width: "90%", paddingLeft: '15px', paddingTop: '5px'       }} />
                      </CardMedia>

                      <CardContent>
                        <Typography gutterBottom variant="h6" component="h6">
                        {tile.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        {tile.description}
                        
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions  alignItems="right"  >

                      <Button size="small" color="black">
                        <Icon style={{  fontSize: 30 }} onClick={() => this.addToCart(tile)} >add_shopping_cart</Icon>
                      </Button>
                    </CardActions>
                  </Card>
                </div>
          ))}


</Carousel>
<br/>
<BottomNavigation className={bottomNav.root}>
          <Link to='/inbox'>
          <BottomNavigationAction label="Chats" icon={<ChatIcon />} onClick={() => this.goToChat()}  />
          </Link>
          <Link to='/cart'>
          <BottomNavigationAction label="Favorites" icon={<CartIcon />} />
          </Link>
          <Link to='/profile'>
          <BottomNavigationAction label="Favorites" icon={<PersonIcon />} />
          </Link>
        </BottomNavigation>

          </Container>

    </React.Fragment>





    );
  }
}

export default Brews;
