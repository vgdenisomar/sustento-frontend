import { Alert } from "react-native";
import { AsyncStorage } from 'react-native';

var ApiUtils = {  
    checkStatus: function(response) {
      if (response.ok) {
        return response;
      } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
        
      }
    },
    async _onValueChange(item, selectedValue) {
      try {
        await AsyncStorage.setItem(item, selectedValue);
        console.log(item);
        console.log(selectedValue);
      } catch (error) {
        console.log('AsyncStorage error: ' + error.message);
      }
    }

  };

  export { ApiUtils as default };