import React from "react";
// prettier-ignore
import { Container, Box, Button, Heading, Text, TextField, Modal, Spinner } from "gestalt";
// prettier-ignore
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements';
import ToastMessage from "./ToastMessage";
import { getCart, calculatePrice, clearCart, calculateAmount } from "../utils";
import { withRouter } from "react-router-dom";
import Strapi from "strapi-sdk-javascript/build/main";


const apiUrl = process.env.API_URL || "https://justo-back.herokuapp.com";
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends React.Component {
  state = {
    cartItems: [],
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    toast: false,
    toastMessage: "",
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async event => {
    event.preventDefault();

    /*
    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }*/

    this.setState({ modal: true });
  };

  handleSubmitOrder = async () => {
    const {
      cartItems,
      city,
      address,
      postalCode,
      confirmationEmailAddress
    } = this.state;

    const amount = calculateAmount(cartItems);
    // Process order
    this.setState({ orderProcessing: true });

    try {

      window.Mercadopago.setPublishableKey("TEST-61c933c3-0d46-43ef-bde1-f5127a2fdfd8");

      const ids = window.Mercadopago.getIdentificationTypes();
      let bin =  "450995"
      const pm = window.Mercadopago.getPaymentMethod({
        "bin": bin
    });

      var form = document.querySelector('#pay');
      window.Mercadopago.createToken(form, (status, response)=>{
        let token = response.id

        strapi.createEntry("orders", {
          amount,
          brews: cartItems,
          city,
          postalCode,
          address,
          token
        });

      });
      
      
      //token = response.token.id;
/*
      await strapi.request("POST", "/email", {
        data: {
          to: confirmationEmailAddress,
          subject: `Order Confirmation - BrewHaha ${new Date(Date.now())}`,
          text: "Your order has been processed",
          html: "<bold>Expect your order to arrive in 2-3 shipping days</bold>"
        }
      });*/
      this.setState({ orderProcessing: false, modal: false });
      clearCart();
      this.showToast("Your order has been successfully submitted!", true);
    } catch (err) {
      this.setState({ orderProcessing: false, modal: false });
      this.showToast(err.message);
    }
  };

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  showToast = (toastMessage, redirect = false) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(
      () =>
        this.setState(
          { toast: false, toastMessage: "" },
          // if true passed to 'redirect' argument, redirect home
          () => redirect && this.props.history.push("/")
        ),
      5000
    );
  };

  closeModal = () => this.setState({ modal: false });

  render() {
    // prettier-ignore
    const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state;

    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          {/* Checkout Form Heading */}
          <Heading color="midnight">Checkout</Heading>
          {cartItems.length > 0 ? (
            <React.Fragment>
              {/* User Cart */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                marginTop={2}
                marginBottom={6}
              >
                <Text color="darkGray" italic>
                  {cartItems.length} Items for Checkout
                </Text>
                <Box padding={2}>
                  {cartItems.map(item => (
                    <Box key={item._id} padding={1}>
                      <Text color="midnight">
                        {item.name} x {item.quantity} - $
                        {item.quantity * item.price}
                      </Text>
                    </Box>
                  ))}
                </Box>
                <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
              </Box>
              {/* Checkout Form */}


              <form
                id="pay"
                name="pay"
                style={{
                  display: "inlineBlock",
                  textAlign: "center",
                  maxWidth: 450
                }}
                onSubmit={this.handleConfirmOrder}
                >

    <fieldset>
        <p>
            <label for="description">Descripción</label>                        
            <input type="text" name="description" id="description" value="Ítem seleccionado"/>
        </p>                    
        <p>
            <label for="transaction_amount">Monto a pagar</label>                        
            <input name="transaction_amount" id="transaction_amount" value="100"/>
        </p>
        <p>
            <label for="cardNumber">Número de la tarjeta</label>
            <input type="text" id="cardNumber" data-checkout="cardNumber" onselectstart="return false" onpaste="return false" onCopy="return false" onCut="return false" onDrag="return false" onDrop="return false" />
        </p>
        <p>
            <label for="cardholderName">Nombre y apellido</label>
            <input type="text" id="cardholderName" data-checkout="cardholderName" />
        </p>                                    
        <p>
            <label for="cardExpirationMonth">Mes de vencimiento</label>
            <input type="text" id="cardExpirationMonth" data-checkout="cardExpirationMonth" onselectstart="return false" onpaste="return false" onCopy="return false" onCut="return false" onDrag="return false" onDrop="return false"  />
        </p>
        <p>
            <label for="cardExpirationYear">Año de vencimiento</label>
            <input type="text" id="cardExpirationYear" data-checkout="cardExpirationYear" onselectstart="return false" onpaste="return false" onCopy="return false" onCut="return false" onDrag="return false" onDrop="return false" />
        </p>
        <p>
            <label for="securityCode">Código de seguridad</label>
            <input type="text" id="securityCode" data-checkout="securityCode" onselectstart="return false" onpaste="return false" onCopy="return false" onCut="return false" onDrag="return false" onDrop="return false"  />
        </p>
        <p>
            <label for="installments">Cuotas</label>
            <select id="installments" class="form-control" name="installments">
              <option value="1">1</option>
            </select>
        </p>
        <p>
            <label for="docType">Tipo de documento</label>
            <select id="docType" data-checkout="docType">
              <option value="1">1</option>
            </select>
        </p>
        <p>
            <label for="docNumber">Número de documento</label>
            <input type="text" id="docNumber" data-checkout="docNumber"/>
        </p>
        <p>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="test@test.com"/>
        </p>  
        <input type="hidden" name="payment_method_id" id="payment_method_id"/>

        <button id="stripe__button" type="submit">
                  Pagar
                </button>
    </fieldset>
</form>




            </React.Fragment>
          ) : (
            // Default Text if No Items in Cart
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your Cart is Empty
              </Heading>
              <Text align="center" italic color="green">
                Add some brews!
              </Text>
            </Box>
          )}
        </Box>
        {/* Confirmation Modal */}
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder
}) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm Your Order"
    heading="Confirm Your Order"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alertdialog"
    size="sm"
  >
    {/* Order Summary */}
    {!orderProcessing && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={2}
        color="lightWash"
      >
        {cartItems.map(item => (
          <Box key={item._id} padding={1}>
            <Text size="lg" color="red">
              {item.name} x {item.quantity} - ${item.quantity * item.price}
            </Text>
          </Box>
        ))}
        <Box paddingY={2}>
          <Text size="lg" bold>
            Total: {calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}



    {/* Order Processing Spinner */}
    <Spinner
      show={orderProcessing}
      accessibilityLabel="Order Processing Spinner"
    />
    {orderProcessing && (
      <Text align="center" italic>
        Submitting Order...
      </Text>
    )}
  </Modal>
);

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
  <StripeProvider apiKey="pk_test_CN8uG9E9KDNxI7xVtdN1U5Be">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;
