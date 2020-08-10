export default {
    actions: {
      clickButton() {
        // :alembic: message params should be username & ethAddress
        window.ethereum.sendAsync(  {
          method: 'personal_sign',
          params: [
              'I control my private key.', window.ethereum.selectedAddress
                  ],
          from: window.ethereum.selectedAddress
      
        },
        (error, response) => {
          if (error) {
            // Handle error. Likely the user rejected the login
            console.error("error with signing message:", error);
          } else {
            // Q: What does the response look like?
            console.log(response);
            // A: It looks like an `0x` prefixed hash
            // TODO: send signed message to backend and recover public key in the backend
            window.ethereum.sendAsync(  {
              method: 'personal_ecRecover',
              params: [
                  'I control my private key.', response.result
                      ],
              from: window.ethereum.selectedAddress
          
            },
            (error, response) => {
              if (error) {
                console.error("error with recovering address:", error);
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