
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, ActivityIndicator, View, Platform, TextInput, TouchableOpacity, Alert
} from 'react-native';

import { PermissionsAndroid } from 'react-native';
import WifiManager from "react-native-wifi-reborn";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retrieveItem, storeItem } from './src/utils/functions';
import DropdownAlert from 'react-native-dropdownalert';




const App = () => {


  const [askGetWifiInfo, setAskGetWifiInfo] = useState(false);
  const [currentSsid, setCurrentSsid] = useState('');
  const [currentSsidPass, setCurrentSsidPass] = useState('');
  const [loading, setLoading] = useState(false);
  let alertRef;



  async function connectWifiManually() {
    setLoading(true)
    let granted = true;
    if (Platform.OS == 'android') {
      granted = getLocationPermission();
    }
    if (granted) {
      const localWifiList = await retrieveItem('wifi_list');
      console.log('wifiList', localWifiList[0]);
      if (localWifiList[0]?.ssid && localWifiList[0]?.password) {
        WifiManager.connectToProtectedSSID(localWifiList.ssid, localWifiList.password, false)
          .then(
            () => {
              setLoading(false)
              alertRef.alertWithType("success", "Connected", '');
              console.log("connectToProtectedSSID successfully!");
            },
            (reason) => {
              setLoading(false)
              alertRef.alertWithType("error", "Error", 'Error connecting to internet');
              console.log("connectToProtectedSSID failed!");
              console.log(reason);
            }
          );
      }

    }
    setLoading(false)


  }

  async function getLocationPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    }
    else return false
  }

  async function getCurrentWifiSSID() {

    let granted = true;
    if (Platform.OS == 'android') granted = await getLocationPermission();
    if (granted) {
      const ssid = await WifiManager.getCurrentWifiSSID()
      return ssid;
    } else {
      // PERMISSION DENIED IN ANDROID
    }

  }

  async function addWifiToDb() { // LOCAL DB

    setLoading(true);
    if (currentSsid && currentSsidPass) {
      const list = {
        ssid: currentSsid,
        password: currentSsidPass
      };
      setLoading(false);
      storeItem('wifi_list', list); // STORE WIFI INFO IN ASYNC STORAGE
      setAskGetWifiInfo(false);
      alertRef.alertWithType("success", "Success", 'Network Added');
    }
    else {
      alertRef.alertWithType("error", "Error", 'Please enter network password');
    }
    setLoading(false);
  }




  useEffect(() => {


    setLoading(true)
    // subscribe to get netinfo state
    const unsubscribeNetInfo = NetInfo.addEventListener(async state => {
      if (state.isConnected) {  // CHECK THAT WE HAVE THIS SSID IN OUR DATABASE OR NOT, IF NOT THEN ASK USER FOR PASSWORD AND STORE IN DATABASE
        retrieveItem('wifi_list') // GET WIFI LIST FROM ASYNC STORAGE
          .then(async data => {
            const ssid = await getCurrentWifiSSID();
            if (ssid) {
              if (!data || data?.ssid != ssid) {
                setCurrentSsid(ssid);
                setAskGetWifiInfo(true)
              }
            }
          })
      }
      else {
        connectWifiManually(); // WIFI IS NOT CONNECTED TRY TO MANUALLY CONNECT;
      }
    });
    setLoading(false);
    return unsubscribeNetInfo;
  }, [])







  return (
    <SafeAreaView style={{ backgroundColor: '#111111', flex: 1, paddingHorizontal: 20 }} >
      <DropdownAlert ref={(ref) => alertRef = ref} />
      {loading && <ActivityIndicator color={"white"} size={"large"} />}
      {askGetWifiInfo ?
        // VIEW TO GET NETWORK PASSWORD FROM USER
        <View style={{ height: "100%", flex: 1 }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 30, alignSelf: 'center', fontSize: 17, fontWeight: 'bold' }}>Save Wifi Network</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 30, }}>Wifi Name</Text>
          <TextInput
            placeholder='Wifi ssid'
            style={{ marginTop: 10, borderRadius: 10, color: '#E2B378', paddingLeft: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' }}
            placeholderTextColor='#E2B378'
            value={currentSsid}
            editable={false}
          />
          <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 15, }}>Wifi Password</Text>
          <TextInput
            style={{ borderRadius: 10, color: 'white', paddingLeft: 10, marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' }}
            placeholderTextColor='rgba(255,255,255,0.8)'
            placeholder='Password'
            onChangeText={(t) => {
              setCurrentSsidPass(t)
            }}
          />
          <TouchableOpacity
            onPress={() => {
              addWifiToDb()
            }}
            style={{ backgroundColor: '#E2B378', borderRadius: 10, marginTop: 50, width: 100, height: 48, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
            <Text style={{ color: '#111111', }}>Save</Text>
          </TouchableOpacity>

        </View>

        :
        <Text style={{ color: 'white', marginTop: 200, alignSelf: 'center', fontSize: 18 }}>Current Network: {currentSsid}</Text>
      }
    </SafeAreaView>
  );
};


export default App;
