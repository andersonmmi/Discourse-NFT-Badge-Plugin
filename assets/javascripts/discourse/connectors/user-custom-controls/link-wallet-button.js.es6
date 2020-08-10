// Current Focus: use regex in a function to populate username into message params

export default {
  actions: {
      
      clickButton() {
          // get username here without defining getUsername()?
        
          const regex = /\/u\/([a-zA-Z0-9_-]*)\//gm;
          const str = window.location.toString;
          let m;
          let username;

          console.log("getUsername fired!")
        
          while ((m = regex.exec(str)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (m.index === regex.lastIndex) {
                  regex.lastIndex++;
              }
              
              // The result can be accessed through the `m`-variable.
              m.forEach((match, groupIndex) => {
                  // log regex match output
                  console.log(`Found match, group ${groupIndex}: ${match}`);
                  username = `${groupIndex}`
              });
          }
        // call getUsername here
        // getUsername();
        console.log("username", username)

        // :alembic: message params should be username & ethAddress
        window.ethereum.sendAsync(  {
          method: 'personal_sign',
          params: [
              `test`, window.ethereum.selectedAddress
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
            // :alembic: username is undefined, but address is recoverable
            window.ethereum.sendAsync(  {
              method: 'personal_ecRecover',
              params: [
                `test`, response.result
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