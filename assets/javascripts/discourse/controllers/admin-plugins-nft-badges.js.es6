export default Ember.Controller.extend({
    web3AddressVisible: false,
  
    actions: {
      showWeb3Address() {
        this.set('web3AddressVisible', true);
      },

      addContract() {
          // TODO: Save NFT Badge contract details to the database
          alert("Coming soon");
      }
    }
  });