/*<--Name : Geeta, assignment 2-->*/

const Order = require("./Order");
const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  CONTACTINFO :Symbol("phone"),
  CHOOSE: Symbol("choose"),
  SIZE: Symbol("size"),
  TOPPINGS: Symbol("toppings"),
  DRINKS: Symbol("drinks"),
  PAYMENT: Symbol("payment")

});
let itemName = [] , itemSize = [] ,itemTopping =[];
module.exports = class GeetaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.sItem = "";
        this.sphoneNumber = "";
    }
    handleInput(sInput){
        let aReturn = [];
        let totalAmount = 0;
        switch(this.stateCur){
            case OrderState.WELCOMING:
              this.stateCur = OrderState.CONTACTINFO;
              aReturn.push("Welcome to Geet's Fast Food.");
              aReturn.push("Enter your name with mobile number"); 
                break;
                case  OrderState.CONTACTINFO:
                  this.stateCur = OrderState.CHOOSE;
                  aReturn.push("Choose pizza , Burger, Canadian Putin");  
                  this.sphoneNumber = sInput; 
              break;
  
              case OrderState.CHOOSE:
                  this.stateCur = OrderState.SIZE;
                  this.sChoosen = sInput;
                 
                  if (sInput.toLowerCase() == "exit") {          
                      aReturn.push("Would you like drinks with that?");
                      this.stateCur = OrderState.DRINKS;
                      totalAmount += 2.99;
                   
                  }else {
                      aReturn.push("What size would you like?");
                      itemName.push(sInput);
                  }               
                  break;
  
            case OrderState.SIZE:
              this.stateCur = OrderState.TOPPINGS
                this.sSize = sInput;
                itemSize.push(sInput);
                aReturn.push("What toppings would you like?");
                totalAmount += 2.99;
                break;
            case OrderState.TOPPINGS:
              this.stateCur = OrderState.CHOOSE
              this.sToppings = sInput;
              itemTopping.push(sInput);
              aReturn.push("Choose pizza , Burger, Canadian Putin \n or enter exit for drinks menu");
              totalAmount += 9.99;
                break;
            case OrderState.DRINKS:
              this.stateCur = OrderState.PAYMENT;
              this.nOrder = 20;
              
              let temp="";
              aReturn.push("Thank-you for your order of");
              for(let i=0 ;i < itemTopping.length; i++){
              temp = itemSize[i] +" " +itemName[i] + " with " +itemTopping[i] +"\n";    
              aReturn.push(temp);
              } 
            
              if (sInput.toLowerCase() != "no") {
                  this.sDrinks = sInput; 
                  totalAmount += 2.99;
              }
              if (this.sDrinks) {
                  aReturn.push(this.sDrinks);
              }
         
              let tax = totalAmount + 0.13;
              totalAmount += tax;
              this.nOrder=totalAmount;
              
              aReturn.push("Your Contact info is : " + this.sphoneNumber);
              aReturn.push(`Your Total amount will be  with 13% tax: $${totalAmount.toFixed(2)}`);
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
  
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
       
      }
      const sClientID = process.env.SB_CLIENT_ID || 'AYABvpxEv53ZEAKz1aU6GtvtdVwciGcZISiXRIqJgDeqbO8TYOhyuGk6fjAJJ0b-vmPGvUG3FZw2ly0h'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }

                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}