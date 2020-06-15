

export default Ember.Controller.extend({
    web3AddressVisible: false,
  
    actions: {
      showWeb3Address() {
        this.set('web3AddressVisible', true);
      },

      addContract() {
          // TODO: Save NFT Badge contract details to the database
            let web3Address = '';
          
            window.ethereum.enable().then((account) =>{
            const defaultAccount = account[0]
            web3.eth.defaultAccount = defaultAccount
            })

            web3Address = defaultAccount

            alert("web3 address:", web3Address);
      }
    }
  });