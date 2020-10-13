import React, { Component } from "react";
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Image, View
} from "react-native";



import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";
import ApiUtils from './ApiUtils';
import { requestPermissionsAsync } from "expo-location";

const VALID_EMAIL = "vgdenisomar@gmail.com";
const VALID_PASSWORD = "123";
var STORAGE_KEY = 'id_token';
var USER = 'user';
const { width, height } = Dimensions.get("window");
const options = {};

export default class Login extends Component {
  state = {
    email: VALID_EMAIL,
    password: VALID_PASSWORD,
    errors: [],
    loading: false
  };

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.setState({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  handleLogin() {
    const { navigation } = this.props;
    const { email, password, longitud, latitud } = this.state;
    const errors = [];
    this.setState({ loading: true });
    Keyboard.dismiss();
    //var value = this.form.getValue();
  
    let url = ApiUtils.urla
    fetch(`http://192.168.1.44:3001/api/security/login`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        longitud:longitud,
        latitud:latitud
      })
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((response) => {
          this.setState({ loading: false });
          ApiUtils._onValueChange(STORAGE_KEY, response.token);
          ApiUtils._onValueChange(USER, JSON.stringify(response.userF[0]));
          navigation.navigate("Browse")
        }
    )
    .catch((err) =>{this.setState({ loading: false });Alert.alert(
      "Error",
      "Credenciales Incorrectas",
      { cancelable: false }
    );console.log('error:', err.message)})
    .done();

  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <KeyboardAvoidingView style={styles.login}>
          <Block >
            <Block middle>
              <Image
                source={require("../assets/images/logoSustento.png")}
                resizeMode="contain"
                style={{ paddingLeft:0,width, height: height / 5, overflow: "visible"}}
              />
              <View style={styles.container}>
              <Input 
                label="Correo electrónico"
                error={hasErrors("email")}
                style={[styles.input, hasErrors("email")]}
                defaultValue={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />
              <Input
                secure
                label="Contraseña"
                error={hasErrors("password")}
                style={[styles.input, hasErrors("password")]}
                defaultValue={this.state.password}
                onChangeText={text => this.setState({ password: text })}
              />
              <Button gradient onPress={() => this.handleLogin()}>
              {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
              <Text bold white center>
                    Entrar
                  </Text>
                )}
              </Button>

              <Button onPress={() => navigation.navigate("Forgot")}>
                <Text
                  gray
                  caption
                  center
                  style={{ textDecorationLine: "underline" }}
                >
                  Ovidaste tu contraseña?
                </Text>
              </Button>
              </View>
              
            </Block>
          </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:theme.sizes.base * 2
  },
  titulo: {
    marginTop:theme.sizes.base*1,
    paddingHorizontal:theme.sizes.base * 2
  },
  login: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent
  }
});
