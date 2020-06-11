export default Ember.Controller.extend({
    web3AddressVisible: false,
  
    actions: {
      showWeb3Address() {
        this.set('web3AddressVisible', true);
      }
    }
  });