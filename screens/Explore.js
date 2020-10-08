import React, { Component } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  BackHandler,
  TouchableOpacity, View
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Card,Button, Input, Block, Text } from "../components";
import { theme, mocks } from "../constants";
import ApiUtils from './ApiUtils';

const { width, height } = Dimensions.get("window");

class Explore extends Component {
  state = {
    searchFocus: new Animated.Value(0.6),
    searchString: null,
    proveedor:"",
    productos:[],
    token:"",
    loading: true,
  };

  handleSearchFocus(status) {
    Animated.timing(this.state.searchFocus, {
      toValue: status ? 0.8 : 0.6, // status === true, increase flex size
      duration: 150 // ms
    }).start();
  }

  renderSearch() {
    const { searchString, searchFocus } = this.state;
    const isEditing = searchFocus && searchString;

    return (
      <Block animated middle flex={searchFocus} style={styles.search}>
        <Input
          placeholder="Search"
          placeholderTextColor={theme.colors.gray2}
          style={styles.searchInput}
          onFocus={() => this.handleSearchFocus(true)}
          onBlur={() => this.handleSearchFocus(false)}
          onChangeText={text => this.setState({ searchString: text })}
          value={searchString}
          onRightPress={() =>
            isEditing ? this.setState({ searchString: null }) : null
          }
          rightStyle={styles.searchRight}
          rightLabel={
            <Icon.FontAwesome
              name={isEditing ? "close" : "search"}
              size={theme.sizes.base / 1.6}
              color={theme.colors.gray2}
              style={styles.searchIcon}
            />
          }
        />
      </Block>
    );
  }

  renderImage(img, index) {
    const { navigation } = this.props;
    const sizes = Image.resolveAssetSource(img);
    const fullWidth = width - theme.sizes.padding * 2.5;
    const resize = (sizes.width * 100) / fullWidth;
    const imgWidth = resize > 75 ? fullWidth : sizes.width * 1;

    return (
      <TouchableOpacity
        key={`img-${index}`}
        onPress={() => navigation.navigate("Product")}
      >
        <Image
          source={img}
          style={[styles.image, { minWidth: imgWidth, maxWidth: imgWidth }]}
        />
      </TouchableOpacity>
    );
  }

  renderFooter() {
    return (
      <LinearGradient
        locations={[0.5, 1]}
        style={styles.footer}
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.6)"]}
      >
        <Button gradient style={{ width: width / 2.678 }}>
          <Text bold white center>
            Filter
          </Text>
        </Button>
      </LinearGradient>
    );
  }

  componentDidMount=async()=>{
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    const { params } = this.props.navigation.state;
    this.setState({
      proveedor:params.nombre,
      imagen: params.imagen,
      distancia: params.distancia,
      token:params.token
    });
    fetch("http://192.168.1.44:3001/api/Products/", {
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
            this.setState({ productos: response, loading:false });
        }
    )
    .catch((err) =>{this.setState({ loading: false });alert("Credenciales Incorrectas");console.log('error:', err.message)})
    .done();
    console.log(this.state.productos);

  }

  render() {
    const { profile, navigation } = this.props;
    const { proveedor,productos, imagen, distancia, loading} = this.state;
    return (
      <Block>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image style={{ width: '100%', height:(width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2 }} source={{ uri: 'http://sustento.000webhostapp.com/'+imagen }} />
          <View style={styles.texto}>
              <Text style={styles.texto2}>{proveedor}</Text>
          </View>
          <View style={styles.distancia}>
              <Text style={styles.distancia2}>{distancia} Km</Text>
          </View>
        </View>
        <View style={{  paddingHorizontal: theme.sizes.base * 1}}> 
           <Text >Breve descripcion del proveedor</Text>
           <Text style={{fontSize:18, marginTop:5}}>Productos</Text>
           <View
            style={{
              borderBottomColor: '#a8b83a',
              borderBottomWidth: 1,
              marginBottom:10
            }}
          />
        </View>
        <View>
        <Block>
        {loading ? (
                  <ActivityIndicator size="large" color="green"/>
                ) : (
          <Block flex={false} row space="between" style={styles.categories}>
            {productos.map(producto => (
              <View>
              <TouchableOpacity
                key={producto.codProd}
                onPress={() => navigation.navigate("Settings",{id:producto.codProd} )}
              >
                <Image style={{ borderTopRightRadius:4,borderTopLeftRadius:4,width: '100%', height:(width - theme.sizes.padding * 2.4 - theme.sizes.base) / 3 }} source={{ uri: 'http://sustento.000webhostapp.com/'+producto.imagenProd }} />
                </TouchableOpacity>
                <Card center middle style={styles.category}>
                  <View style={styles.texto}>
                    <Text medium height={20} style={styles.texto2} >
                      {producto.nomProd}
                    </Text>
                  </View>
                  <Text gray caption>
                    {producto.productos} productos
                  </Text>
                  <Text style={{ color:'green'}} medium height={20}>
                    {producto.distancia} KM
                  </Text>
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
  images: mocks.explore
};

export default Explore;

const styles = StyleSheet.create({
  container:{
    marginTop:10,
    paddingHorizontal: theme.sizes.base * 1,
    position:"relative",
    textAlign:"center"
  },
  texto:{
    borderRadius:5,
    position: "absolute",
    top:8,
    left:22,
    backgroundColor:"#F7CC20"
  },
  texto2:{
    paddingHorizontal: theme.sizes.base * 1,
    paddingVertical: theme.sizes.base * 0.5,
    color:"white",
    fontSize:25
  },
  distancia:{
    borderRadius:5,
    position: "absolute",
    bottom:-10,
    right:22,
    backgroundColor:"#a8b83a"
  },
  distancia2:{
    paddingHorizontal: theme.sizes.base * 0.5,
    paddingVertical: theme.sizes.base * 1,
    color:'white',
    fontSize:14
  },
  titulo: {
    marginTop:theme.sizes.base*1
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
    marginBottom: theme.sizes.base * 3.5
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2
  }
});
