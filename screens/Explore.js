import React, { Component } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  BackHandler,
  RefreshControl,
  TouchableOpacity, AsyncStorage, View, Modal
} from "react-native";
import NumericInput from 'react-native-numeric-input'
import * as Icon from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons, EvilIcons, Entypo, AntDesign, MaterialIcons} from '@expo/vector-icons';
import Toast from 'react-native-root-toast'

import { Card, Button, Input, Block, Text } from "../components";
import { theme, mocks } from "../constants";
import ApiUtils from './ApiUtils';
import { Header } from 'react-navigation-stack';

const { width, height } = Dimensions.get("window");

class Explore extends Component {
  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButton.bind(this);
}
  state = {
    searchFocus: new Animated.Value(0.6),
    searchString: null,
    proveedor: "",
    productos: [],
    token: "",
    loading: true,
    modalVisible: false,
    loadingModal: false,
    codProd: 0,
    cantidad: 1,
    latitud:0,
    longitud:0,
    refreshing:false,
  };

  static navigationOptions = ({navigation}) => ({
    title: 'Panaderia'
})
  renderFooter() {
    return (
      <LinearGradient
        locations={[0.5, 1]}
        style={styles.footer}
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.6)"]}
      >
        <Button gradient style={{ width: width / 2.678 }}>
          <Text bold white center>
            VER MI PEDIDO
          </Text>
        </Button>
      </LinearGradient>
    );
  }

  modal(id) {
    this.setState({
      modalVisible: true,
      codProd: id
    })
  }
  hideModal() {
    this.setState({
      modalVisible: false
    })
  }
  agregar = async () => {
    this.setState({
      loadingModal: true
    })
    const { cantidad, codProd } = this.state;
    const { params } = this.props.navigation.state;
    var user = JSON.parse(await AsyncStorage.getItem('user'));
    fetch(window.$url+'api/Carrito/agregar', {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + params.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codProd: codProd,
        codCliente: user.codCliente,
        cantidad: cantidad
      })
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          modalVisible: false, loadingModal: false, cantidad: 1
        });
        Toast.show('Agregado', { duration: Toast.durations.SHORT, backgroundColor: 'rgb(52, 52, 52)' });
      }
      )
      .catch((err) => { this.setState({ loading: false }); alert("Credenciales Incorrectas"); console.log('error:', err.message) })
      .done();
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.getProductos();
    console.log(Header.HEIGHT);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}

  handleBackButton = () => {
    this.props.navigation.goBack(null,BackHandler.addEventListener('hardwareBackPress', this.handleBackButton));
    return true;
   } 
 

  getProductos(){
    const { params } = this.props.navigation.state;
    this.setState({
      proveedor: params.nombre,
      imagen: params.imagen,
      distancia: params.distancia,
      token: params.token,
      latitud:params.latitud,
      longitud:params.longitud
    });
    fetch(window.$url+'api/Products/', {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + params.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codProveedor: params.id,
      })
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((response) => {
        this.setState({ productos: response, loading: false, refreshing:false});
      }
      )
      .catch((err) => { this.setState({ loading: false }); alert("Credenciales Incorrectas"); console.log('error:', err.message) })
      .done();
  }

  onRefresh = () =>{
    this.setState({refreshing:true});
    this.getProductos();
  };

  render() {
    const { profile, navigation } = this.props;
    const { proveedor, productos, imagen, distancia, modalVisible, loading, loadingModal, codProd, cantidad,latitud,longitud, refreshing } = this.state;
    console.log(latitud);
    return (
      <Block>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.hideModal();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Ingrese la cantidad</Text>
              <NumericInput
                onChange={text => this.setState({ cantidad: text })}
                minValue={1}
                value={cantidad}
              />
              <AntDesign onPress={() => { this.hideModal(); }} name="close" size={30} color="black" style={{ top: 0, left: 0, position: "absolute", textAlign: 'right', margin: 10 }} />
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "#a8b83a" }}
                onPress={() => {
                  this.agregar();
                }}
              >
                {loadingModal ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={styles.textStyle}>Agregar al pedido</Text>
                  )}
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false} onScroll={ Animated.event([{nativeEvent: {contentOffset: {y: this._animatedValue}}}]) }
            scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={styles.container}>
            <Image style={{ width: '100%', height: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 1.7 }} source={{ uri: 'http://sustento-pro.herokuapp.com/' + imagen }} />
            <TouchableOpacity style={styles.back} onPress={() => navigation.navigate("Browse")}>
              <AntDesign style={styles.back2} name='left' color='white' size={36}></AntDesign>
            </TouchableOpacity>
            <View style={styles.texto}>
              <Text style={styles.texto2}>{proveedor}</Text>
            </View>
            <TouchableOpacity style={styles.distancia}
              onPress={() => navigation.navigate("Map", { latitud: latitud, longitud: longitud})}
            >
              <Text style={styles.distancia2}>{distancia} Km</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: theme.sizes.base * 1 }}>
            <View
              style={{
                marginBottom: 10,
                marginTop: 10
              }}
            />
          </View>
          <View>
            <Block style={{ marginBottom: height / 12 }}>
              {loading ? (
                <ActivityIndicator size="large" color="green" />
              ) : (
                  <Block flex={false} row space="between" style={styles.categories}>
                    {productos.map(producto => (
                      <View key={producto.codProd}>
                        <TouchableOpacity
                          key={producto.codProd}
                          onPress={() => navigation.navigate("DetalleProducto", { id: producto.codProd, nombre:producto.nomProd,descripcion:producto.desc,cantidad:producto.cant,imagen:producto.imagenProd,normal:producto.precioProd, oferta:producto.precioOfProd,  })}
                        >
                          <Image style={{ borderTopRightRadius: 4, borderTopLeftRadius: 4, width: '100%', height: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 3 }} source={{ uri: 'http://sustento.000webhostapp.com/' + producto.imagenProd }} />
                        </TouchableOpacity>
                        <Card middle style={styles.category}>
                        <View style={styles.producto}>
                          <Text style={styles.producto2}>{producto.nomProd}</Text>
                        </View>
                          <TouchableOpacity onPress={() => this.modal(producto.codProd)}
                          style={{ top: 0, right: 0, position: "absolute", textAlign: 'right', paddingRight: 5  }}>
                            <Ionicons name='ios-add-circle-outline' size={36}></Ionicons>
                          </TouchableOpacity>
                          <Text style={{ textAlign: 'left', fontSize:12,marginTop:10, color:"#0006",textDecorationLine: 'line-through', textDecorationStyle: 'solid'}} >L. {producto.precioProd.toFixed(2)} </Text>
                          <Text style={{ textAlign: 'left'}} >L. {producto.precioOfProd.toFixed(2)} </Text>
                          <Text style={{ textAlign: 'left', marginRight: 10, fontWeight:"bold", fontSize:11  }} >*Disponible hasta el 27 de enero</Text>
                        </Card>
                      </View>

                    ))}
                  </Block>
                )}
            </Block>
          </View>

        </ScrollView>

        {this.renderFooter()}
      </Block>
    );
  }
}

Explore.defaultProps = {
  images: mocks.explore,
};

export default Explore;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: '#000000AA',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#a8b83a",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width:'50%'
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  container: {
    position: "relative",
    textAlign: "center",
  },
  texto: {
    borderRadius: 5,
    position: "absolute",
    marginTop: Header.HEIGHT*0.5,
    top: 10,
    left: 50,
  },
  texto2: {
    color: "white",
    fontWeight:"bold",
    fontSize: 25
  },
  back: {
    borderRadius: 5,
    position: "absolute",
    marginTop: Header.HEIGHT*0.5,
    top: 15,
    left: 10,
  },
  back2: {
    color: "white",
    fontSize: 25
  },
  distancia: {
    borderRadius: 5,
    position: "absolute",
    bottom: -10,
    right: 22,
    backgroundColor: "#a8b83a"
  },
  distancia2: {
    paddingHorizontal: theme.sizes.base * 0.5,
    paddingVertical: theme.sizes.base * 1,
    color: 'white',
    fontSize: 14
  },
  producto: {
    borderRadius: 6,
    position: "absolute",
    top: -22,
    left: 5,
    backgroundColor: "#F7CC20",
  },
  producto2: {
    paddingHorizontal: theme.sizes.base * 1,
    paddingVertical: theme.sizes.base * 0.3,
    color: "white"
  },
  titulo: {
    marginTop: theme.sizes.base * 1
  },
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base * 2
  },
  search: {
    height: theme.sizes.base * 2,
    width: width - theme.sizes.base * 2
  },
  searchInput: {
    fontSize: theme.sizes.caption,
    height: theme.sizes.base * 2,
    backgroundColor: "rgba(142, 142, 147, 0.06)",
    borderColor: "rgba(142, 142, 147, 0.06)",
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5
  },
  searchRight: {
    top: 0,
    marginVertical: 0,
    backgroundColor: "transparent"
  },
  searchIcon: {
    position: "absolute",
    right: theme.sizes.base / 1.333,
    top: theme.sizes.base / 1.6
  },
  explore: {
    marginHorizontal: theme.sizes.padding * 1.25
  },
  image: {
    minHeight: 100,
    maxHeight: 130,
    maxWidth: width - theme.sizes.padding * 2.5,
    marginBottom: theme.sizes.base,
    borderRadius: 4
  },
  mainImage: {
    minWidth: width - theme.sizes.padding * 2.5,
    minHeight: width - theme.sizes.padding * 2.5
  },
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.1,
    width,
    paddingBottom: theme.sizes.base * 4
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
    paddingHorizontal: theme.sizes.base * 1.5,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    borderTopLeftRadius:0,
    borderTopRightRadius:0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
    paddingHorizontal: theme.sizes.base * 0.5,
    borderColor:"#a8b83a",
    borderWidth:1,
    borderTopWidth:0,
    // this should be dynamic based on screen width
    paddingBottom: theme.sizes.base + 2,
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2
  }
});
