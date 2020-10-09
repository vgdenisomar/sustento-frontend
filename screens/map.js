import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar ,
    TouchableOpacity,
    AppRegistry,
    ActivityIndicator,
    ListView,
    FlatList,
    Image,
    TextInput,
    AsyncStorage,
    Button,
    ToastAndroid
  } from 'react-native';
  
import MapView from 'react-native-maps';

export default class map extends Component{ 
 
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true
        }
      }
    render(){
        const { params } = this.props.navigation.state;
        console.log(params);
        return(
            <View style={styles.container}>
                <MapView style={styles.map}
                region={{
                    latitude:parseFloat(params.latitud),
                    longitude:parseFloat(params.longitud),
                    latitudeDelta:0.1,
                    longitudeDelta:0.1
                }}
                >
                    <MapView.Marker
                    coordinate={{
                        latitude:parseFloat(params.latitud),
                        longitude:parseFloat(params.longitud),
                    }}
                    />

                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    map:{
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0,
    }
})