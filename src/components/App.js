import React, { Component } from "react";
// prettier-ignore
import { Container, Box, Heading, Image, Text, SearchField, Icon } from "gestalt";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import "./App.css";
import Strapi from "strapi-sdk-javascript/build/main";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

/****MATERIAL */
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { initialize } from "../utils/talk";



const apiUrl = process.env.API_URL || "http://ec2-18-223-187-192.us-east-2.compute.amazonaws.com:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  };

  
  async componentDidMount() {
    try {

//Init chat
initialize()

      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
            comerciantes {
              _id
              name
              description
              image {
                url
              }
            }
          }`
        }
      });
      // console.log(response);
      this.setState({ brands: response.data.comerciantes, loadingBrands: false });
    } catch (err) {
      console.error(err);
      this.setState({ loadingBrands: false });
    }
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value }, () => this.searchBrands());
  };

  // filteredBrands = ({ searchTerm, brands }) => {
  //   return brands.filter(brand => {
  //     return (
  //       brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   });
  // };

  searchBrands = async () => {
    const response = await strapi.request("POST", "/graphql", {
      data: {
        query: `query {
          comerciantes(where: {
            name_contains: "${this.state.searchTerm}"
          }) {
            _id
              name
              description
              image {
                url
              }
          }
        }`
      }
    });
    // console.log(this.state.searchTerm, response.data.comerciantes);
    this.setState({
      brands: response.data.comerciantes,
      loadingBrands: false
    });
  };

  goToChat = () => {
    //alert('La Vida')
  };


  render() {
    const { searchTerm, loadingBrands, brands } = this.state;

    const listaProductos = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#64b5f6',
      },
      gridList: {
        width: 500,
        height: 450,
      },
      icon: {
        color: 'rgba(255, 255, 255, 0.54)',
      },
    };

    const bottomNav = {
      root: {
        width: 500,
      },
    }

    
 

    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            value={searchTerm}
            placeholder="Busca productos, proveedores, servicios ..."
          />
          <Box margin={3}>
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/* Brands Section */}
    <div className={listaProductos.root}>
      <GridList cellHeight={180} className={listaProductos.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div"></ListSubheader>
        </GridListTile>
        {brands.map((tile) => (


          <GridListTile key={tile._id}>
            <img src= {`${apiUrl}${tile.image.url}`}  alt={tile.description} />
          <Link to={`/${tile._id}`}>

            
            <GridListTileBar
              title={tile.description}
              subtitle={<span>by: {tile.name}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.description}`} className={listaProductos.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </Link>

          </GridListTile>



        ))}
      </GridList>
    </div>

    <BottomNavigation
      className={bottomNav.root}
    >
      <Link to='/chat'>
      <BottomNavigationAction label="Chats" icon={<ChatIcon />} onClick={() => this.goToChat()}  />
      </Link>
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
    </BottomNavigation>

        {/* Brands */}

        {/* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" /> */}
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
