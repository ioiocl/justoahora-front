import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
// prettier-ignore

import { calculatePrice, setCart, getCart } from "../utils";

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
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
//import Carousel from 'react-material-ui-carousel'
import Paper from '@material-ui/core'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Divider from '@material-ui/core/Divider';

import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';



const apiUrl = process.env.API_URL || "http://ec2-18-223-187-192.us-east-2.compute.amazonaws.com:1337";
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brews: [],
    brand: "",
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
      this.setState({
        brews: response.data.comerciante.productos,
        brand: response.data.comerciante.name,
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
    const { brand, brews, cartItems, description } = this.state;
    const cardStyle = {
      root: {
        display: 'block',
        width: '30vw',
        transitionDuration: '0.3s',
        height: '25vw'
      },
      media: {
        width: '30px',
        
      },
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

    return (
      <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        

        <Card className={cardStyle.root} >
            <CardActionArea>


              <CardMedia title="Title">
                <img src="http://ec2-18-223-187-192.us-east-2.compute.amazonaws.com:1337/uploads/7df9ebf0acc044f1bfbed43fb4533e37.jpg" className={cardStyle.media} />
              </CardMedia>

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                {brand}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                Desayunos con sentido
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>





      </Container>

      <Divider />
      <br/>

      <Container maxWidth="lg">





          <Carousel
  swipeable={false}
  draggable={false}
  showDots={true}
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
                <div>
                  <img src={`${apiUrl}${tile.image.url}`} alt={tile.name} width="80%" />
                </div>
          ))}


</Carousel>;

          </Container>

    </React.Fragment>





    );
  }
}

export default Brews;
