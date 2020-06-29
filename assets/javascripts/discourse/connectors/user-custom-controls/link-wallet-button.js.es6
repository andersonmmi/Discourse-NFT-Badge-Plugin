export default {
    actions: {
      clickButton() {
        self.add_note(1, "test", "ME");
        alert("button clicked");
      },
      // key_for(user_id){
      //  return `notes:${user_id}`
      // }
    }
  };