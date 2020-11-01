import React, { Component } from "react";
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet
} from "react-native";

import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";
import ApiUtils from './ApiUtils';

export default class SignUp extends Component {
  state = {
    email: null,
    name: null,
    password: null,
    errors: [],
    loading: false
  };

  handleSignUp() {
    const { navigation } = this.props;
    const { email, name, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });
    console.log(email, name, password);

    if(name === null || email === null || password === null){
      this.setState({ loading: false });
      return Alert.alert(
        "Error",
        "Llene todos los campos", [
          { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
        { cancelable: false }
      );
    }

    if(!(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(email)){
      this.setState({ loading: false });
      return Alert.alert(
        "Error",
        "El correo electrónico debe ser uno válido",[
          { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
        { cancelable: false }
      );
    }

    if(! (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z\.!@#$%]{8,32}$/).test(password)){
      this.setState({ loading: false });
      return Alert.alert(
        "Error",
        "La contraseña debe contener al menos una Mayúscula, una Minúscula, un número y un signo especial ! @ # $ % y mínimo 8 caracteres",[
          { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
        { cancelable: false }
      );
    }

    fetch(window.$url+'api/security/signin',{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password
      })
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
          this.setState({ loading: false });
          Alert.alert(
            "Bienvenido!",
            "Su cuenta fue creada con éxito",
            [
              {
                text: "Continuar",
                onPress: () => {
                  navigation.navigate("Login");
                }
              }
            ],
            { cancelable: false }
          );
          
        }
    )
    .catch((err) =>{this.setState({ loading: false });Alert.alert(
      "Error",
      "Ya existe una cuenta con este correo",
      { cancelable: false }
    );console.log('error:', err.message)})
    .done();
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <KeyboardAvoidingView style={styles.signup} behavior={Platform.OS == "ios" ? "padding" : "padding"}>
 <        Block padding={[0, theme.sizes.base * 2]}>
          <Block middle>
            <Input
              email
              label="Correo electrónico"
              error={hasErrors("email")}
              style={[styles.input, hasErrors("email")]}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Input
              label="Nombre de usuario"
              error={hasErrors("name")}
              style={[styles.input, hasErrors("name")]}
              defaultValue={this.state.name}
              onChangeText={text => this.setState({ name: text })}
            />
            <Input
              secure
              label="Contraseña nueva"
              error={hasErrors("password")}
              style={[styles.input, hasErrors("password")]}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleSignUp()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Registrarte
                </Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate("Login")}>
              <Text
                gray
                caption
                center
                style={{ textDecorationLine: "underline" }}
              >
                Volver al Login
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
       
    );
  }
}

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    justifyContent: "center"
  },
  titulo: {
    marginTop:theme.sizes.base*1,
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
