import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  BackHandler,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity, AsyncStorage,Alert 
} from "react-native";

import { Card, Badge, Button, Block, Text } from "../components";
import { theme, mocks } from "../constants";
import ApiUtils from './ApiUtils';

const { width } = Dimensions.get("window");

var app = {
  backButtonDialog: true
};


class Browse extends Component {
  state = {
    active: "Products",
    proveedores: [],
    loading: true,
    user:"",
    backButtonDialog: true,
    token:""
  };


  componentDidMount=async()=>{
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    var token=await AsyncStorage.getItem('id_token');
    var user =JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({user:'Bienvenido '+user.nomCliente});
    fetch("http://192.168.0.25:3001/api/Proveedores/", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codCliente: user.codCliente,
      })
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((response) => {
            this.setState({ proveedores: response, loading:false, token:token });
        }
    )
    .catch((err) =>{this.setState({ loading: false });alert("Credenciales Incorrectas");console.log('error:', err.message)})
    .done();

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

    handleBackButton() {
      if(app.backButtonDialog){
        // Prompt for exit
        Alert.alert(
          'Exit app',
          'Exit app?',
          [
            { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false })
        return true;
    }else{
        return false;
    }
  }

  render() {
    const { profile, navigation } = this.props;
    const { proveedores,loading, user, token } = this.state;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>
            {user}
          </Text>
          <Button onPress={() => navigation.navigate("Settings")}>
            <Image source={profile.avatar} style={styles.avatar} />
          </Button>
        </Block>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2 }}
        >
          {loading ? (
                  <ActivityIndicator size="large" color="green"/>
                ) : (
          <Block flex={false} row space="between" style={styles.categories}>
            {proveedores.map(proveedor => (
              <TouchableOpacity
                key={proveedor.codProveedor}
                onPress={() => navigation.navigate("Explore",{id:proveedor.codProveedor, nombre:proveedor.nomProveedor, latitud:proveedor.latitud, longitud:proveedor.longitud, imagen:proveedor.imagen, distancia:proveedor.distancia, token:token} )}
              >
                <Image style={{ borderTopRightRadius:4,borderTopLeftRadius:4,width: '100%', height:(width - theme.sizes.padding * 2.4 - theme.sizes.base) / 3 }} source={{ uri: 'http://sustento.000webhostapp.com/'+proveedor.imagen }} />
                <Card center middle style={styles.category}>
                  <View style={styles.texto}>
                    <Text medium height={20} style={styles.texto2} >
                      {proveedor.nomProveedor}
                    </Text>
                  </View>
                  <Text gray caption>
                    {proveedor.productos} productos
                  </Text>
                  <Text style={{ color:'green'}} medium height={20}>
                    {proveedor.distancia} KM
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
          )}
        </ScrollView>
      </Block>
    );
  }
}

Browse.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories
};

export default Browse;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2
  },
  texto:{
    borderRadius:5,
    backgroundColor:"#F7CC20"
  },
  texto2:{
    paddingHorizontal: theme.sizes.base * 1,
    color:"white",
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3
  },
  categories: {
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,

elevation: 5,
    flexWrap: "wrap",
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5
  },
  category: {
    borderRadius: 6,
    borderTopRightRadius:0,
    borderTopLeftRadius:0,
    padding: theme.sizes.base + 4,
    marginBottom: theme.sizes.base,
    /*shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,*/
    // this should be dynamic based on screen width
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2
  }
});
