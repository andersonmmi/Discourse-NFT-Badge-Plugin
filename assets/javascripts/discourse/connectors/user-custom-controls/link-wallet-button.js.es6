export default {
    actions: {
      clickButton() {
        // self.add_note(1, "test", "ME");
        // alert("button clicked");
        window.web3.currentProvider.sendAsync(  {
          method: 'personal_sign',
          params: [
              'I control my private key.', window.ethereum.selectedAddress
                  ],
          from: window.ethereum.selectedAddress
      
        },
        (error, response) => {
          if (error) {
            // Handle error. Likely the user rejected the login
            console.error("error:", error);
          } else {
            // TODO: send signed message to backend and recover public key in the backend
            window.web3.currentProvider.sendAsync(  {
              method: 'personal_ecRecover',
              params: [
                  'I control my private key.', response.result
                      ],
              from: window.ethereum.selectedAddress
          
            },
            (error, response) => {
              if (error) {
                // Handle error. Likely the user rejected the login
                console.error("error:", error);
              } else {
                console.log(response.result);
              }
            });
          }
        })
      },
      // key_for(user_id){
      //  return `notes:${user_id}`
      // }
    }
  };