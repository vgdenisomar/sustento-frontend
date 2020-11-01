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

const { width, height } = Dimensions.get("window");



class DetalleProducto extends Component {

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
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const { profile, navigation } = this.props;
    const { params } = this.props.navigation.state;
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
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.agregar();
                }}
              >
                {loadingModal ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                    <Text style={styles.textStyle}>Agregar al pedido</Text>
                  )}
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={styles.container}>
            <Image style={{ width: '100%', height: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2 }} source={{ uri: 'http://sustento.000webhostapp.com/' + params.imagen }} />
            <View style={styles.texto}>
              <Text style={styles.texto2}>{params.nombre}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: theme.sizes.base * 1 }}>
            <Text >Breve descripcion del proveedor</Text>
            <Text style={{ fontSize: 18, marginTop: 5 }}>Productos</Text>
            <View
              style={{
                borderBottomColor: '#a8b83a',
                borderBottomWidth: 1,
                marginBottom: 10
              }}
            />
          </View>
          <View>
            <Block style={{ marginBottom: height / 12 }}>

            </Block>
          </View>

        </ScrollView>

        {this.renderFooter()}
      </Block>
    );
  }
}

DetalleProducto.defaultProps = {
  images: mocks.explore,
};

export default DetalleProducto;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
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
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10
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
    marginTop: 10,
    paddingHorizontal: theme.sizes.base * 1,
    position: "relative",
    textAlign: "center"
  },
  texto: {
    borderRadius: 5,
    position: "absolute",
    bottom: -10,
    left: 22,
    backgroundColor: "#F7CC20"
  },
  texto2: {
    paddingHorizontal: theme.sizes.base * 1,
    paddingVertical: theme.sizes.base * 0.5,
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
    borderRadius: 2,
    position: "absolute",
    top: -22,
    left: 5,
    backgroundColor: "#F7CC20",
  },
  producto2: {
    paddingHorizontal: theme.sizes.base * 1,
    paddingVertical: theme.sizes.base * 0.3,
    color: "white",
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
    paddingHorizontal: theme.sizes.base * 2,
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
    backgroundColor:"#a8b83a",
    paddingHorizontal: theme.sizes.base * 0.5,
    // this should be dynamic based on screen width
    paddingBottom: theme.sizes.base + 2,
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2
  }
});
