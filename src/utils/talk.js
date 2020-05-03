import Talk from 'talkjs';

var session = {}
var operator = {}
var me = {}
var stone = "la vida bella"
var me = {}

export async function initialize() {

    stone = "PEPE STONE"

    await Talk.ready;





    

    

/*
   me = new Talk.User({
        // must be any value that uniquely identifies this user
        id: "123456",
        name: "George Looney",
        email: "george@looney.net",
        photoUrl: "https://talkjs.com/docs/img/george.jpg"
    });

    session = await new Talk.Session({
        appId: "tyKjc8mf",
        me: me
    });
   
   operator = new Talk.User({
        // just hardcode any user id, as long as your real users don't have this id
        id: "myapp_operator",
        name: "ExampleApp Operator",
        email: "support@example.com",
        photoUrl: "http://dmssolutions.nl/wp-content/uploads/2013/06/helpdesk.png",
        welcomeMessage: "Hi there! How can I help you?"
    });


    var conversation = session.getOrCreateConversation("item_2493");
    conversation.setParticipant(me);
    conversation.setParticipant(operator);
    */
   
    
    //var chatbox = talkSession.createChatbox(conversation);

}
export const getSession = () => {
    return session;
}

export const getMe = () => {
    return me;
}

export const getOperator = () => {
    return operator;
}

export async function getPromise () {

    await Talk.ready;
    let idCliente = localStorage.getItem("user_id")


    var me = new Talk.User({
        // must be any value that uniquely identifies this user
        id: idCliente,
        name: "Pitu",
        email: "george@looney.net",
        photoUrl: "https://talkjs.com/docs/img/george.jpg"
    });

    return new Promise((resolve, reject) => {

        try{
            resolve(new Talk.Session({
                appId: "tyKjc8mf",
                me: me
            }))
        }catch(err){
            reject(new Error('Menor a 5'))
        }
        


    });
}