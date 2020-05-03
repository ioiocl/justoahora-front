import React from "react";
import Button from '@material-ui/core/Button';

import Container from '@material-ui/core/Container';
import { setToken } from "../utils";
import ToastMessage from "./ToastMessage";
import Talk from "talkjs";
import { calculatePrice, setCart, getCart } from "../utils";
import { Box, Heading, Text, Image, Mask } from "gestalt";
import { Link } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';




import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://ec2-18-223-187-192.us-east-2.compute.amazonaws.com:1337";
const strapi = new Strapi(apiUrl);

class Cart extends React.Component {
    state = {
        cartItems: []
      };
    
      componentDidMount() {

          this.setState({
            cartItems: getCart()
          });
        } 
      
    

  render() {
    const { cartItems} = this.state;


    return (


      <Container >
        
            <Box alignSelf="end" marginTop={2} marginLeft={8}>
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              {/* User Cart Heading */}
              <Heading align="center" size="sm">
                Mi Carro
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {/* Cart Items */}
              {cartItems.map(item => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} - $
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item._id)}
                  />
                </Box>
              ))}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>

      </Container>
    );
  }
}

export default Cart;
