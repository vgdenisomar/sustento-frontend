import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  BackHandler,
  RefreshControl,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity, AsyncStorage, Alert
} from "react-native";
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons'; import { Card, Badge, Button, Block, Text } from "../components";
import { theme, mocks } from "../constants";
import ApiUtils from './ApiUtils';

const { width } = Dimensions.get("window");

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

var app = {
  backButtonDialog: true
};


class Browse extends Component {
  state = {
    active: "Products",
    proveedores: [],
    loading: true,
    user: "",
    backButtonDialog: true,
    token: "",
    refreshing: false
  };

  onButtonPress = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // then navigate
    navigate('NewScreen');
  }
  
  handleBackButton = () => {
    BackHandler.exitApp()
    return true;
  } 

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.getProveedores();
  }

  getProveedores = async () => {
    var token = await AsyncStorage.getItem('id_token');
    var user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({ user: '¡Hola ' + user.nomCliente + '!'});
    fetch(window.$url+'api/Proveedores/', {
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
        this.setState({ proveedores: response, loading: false, token: token, refreshing: false });
      }
      )
      .catch((err) => { this.setState({ loading: false }); alert("Credenciales Incorrectas"); console.log('error:', err.message) })
      .done();
  }


  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getProveedores();
  };

  render() {
    const { profile, navigation } = this.props;
    const { proveedores, loading, user, token, refreshing } = this.state;

    return (
      <Block>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 0 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
          }
        >
          {loading ? (
            <ActivityIndicator size="large" color="green" style={{paddingTop:20}} />
          ) : (
              <View>
                <Block flex={false} row center space="between" style={styles.header}>
                  <Text h1 bold>
                    {user}
                  </Text>
                  <Button onPress={() => navigation.navigate("Settings")}>
                    <Image source={profile.avatar} style={styles.avatar} />
                  </Button>
                </Block>
                <View style={styles.categories}>
                  {proveedores.map(proveedor => (
                    <TouchableOpacity
                      key={proveedor.codProveedor}
                      style={styles.category}
                      onPress={() => {navigation.navigate("Explore", { id: proveedor.codProveedor, nombre: proveedor.nomProveedor, latitud: proveedor.latitud, longitud: proveedor.longitud, imagen: proveedor.imagen, distancia: proveedor.distancia, token: token })}}
                    >
                      <Image style={{ borderTopRightRadius: 3, borderTopLeftRadius: 3, width: '100%', height: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 3 }} source={{ uri: 'http://sustento-pro.herokuapp.com/' + proveedor.imagen }} />
                      <View style={styles.texto}>
                        <Text style={styles.texto2} >
                          {proveedor.nomProveedor}
                        </Text>
                      </View>
                      <View style={{ padding: 6, paddingTop: 10 }}>
                        <Text gray caption>
                          <Ionicons name="md-time" size={24} color="black" /> 10:00 am - 19:00 pm
                    </Text>
                        <View style={{ padding:6,paddingTop:10,right:0,position:"absolute",flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <AntDesign name="bars" size={20} color="black" />
                          <Text>
                            {proveedor.productos} productos
                    </Text>
                        </View>
                        <Text style={{ color: 'green', paddingTop: 5, paddingLeft: 3 }} medium height={20}>
                          <FontAwesome name="map-marker" size={24} color="black" /> {proveedor.distancia} KM
                    </Text>
                      </View>

                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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
  texto: {
    borderRadius: 5,
    position: "absolute",
    top: 80,
    left: 22,
    backgroundColor: "#F7CC20",
  },
  texto2: {
    paddingHorizontal: theme.sizes.base * 1,
    paddingVertical: theme.sizes.base * 0.5,
    color: "white",
    fontSize: 18
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
    paddingHorizontal: theme.sizes.base * 1.5,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 1,
    borderRadius: 3,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
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
    minWidth: (width - theme.sizes.padding * 1.4 - theme.sizes.base),
    maxWidth: (width - theme.sizes.padding * 1.4 - theme.sizes.base),
    maxHeight: (width - theme.sizes.padding * 1.4 - theme.sizes.base),
  }
});
