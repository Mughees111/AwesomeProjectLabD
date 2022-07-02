
import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import { PermissionsAndroid } from 'react-native';
import CaptureView from './CaptureView';

const App = () => {

  const [stream, setStream] = useState(null);



  async function getPermissions() {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        PermissionsAndroid.request('camera').then((response) => {
          if (response === 'authorized') {
            // here you can use your MediaStream code...
          }
        });


        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }


  async function start() {

    const permission = await getPermissions();
    console.log(mediaDevices)
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      console.log('sourceInfos',sourceInfos);
      console.log('videosourceid',videoSourceId);
      // mediaDevices.getUserMedia({
      //   audio: true,
      //   video: {
      //     width: 640,
      //     height: 480,
      //     frameRate: 30,
      //     facingMode: (isFront ? "user" : "environment"),
      //     deviceId: videoSourceId
      //   }
      // })
      console.log(mediaDevices);
      mediaDevices.getUserMedia({audio: true, video: true})
        .then(stream => {
          console.log('here is the stram',stream);
          // Got stream!
        })
        .catch(error => {
          console.log('here is the error',error);

          // Log error
        });
    });


    // console.log('start', stream);

    // if (!stream) {
    //   let s;
    //   console.log('not')
    //   try {
    //     s = await mediaDevices.getUserMedia({
    //       audio: true,
    //       video: {
    //         width: 640,
    //         height: 480,
    //         frameRate: 30,
    //         facingMode : "user",
    //         // facingMode: (isFront ? "user" : "environment"),
    //         deviceId: videoSourceId 
    //       }
    //     });
    //     console.log('yesy')
    //     console.log('s == ', s)
    //     setStream(s);
    //   } catch (e) {
    //     console.error('e', e);
    //   }
    // }
  };

  const stop = () => {
    console.log('stop');
    if (stream) {
      stream.release();
      setStream(null);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <Text style={{ marginTop: 50, color: 'black' }}>asd</Text>
      </View>
      {/* <CaptureView/> */}
      <SafeAreaView style={styles.body}>
        {/* {
          stream &&
          <RTCView
            streamURL={stream.toURL()}
            style={styles.stream} />
        } */}
        <View
          style={styles.footer}>
          <Button
            title="Start"
            onPress={() => start()} />
          <Button
            title="Stop"
            onPress={() => stop()} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill
  },
  stream: {
    flex: 1
  },
  footer: {
    backgroundColor: Colors.lighter,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
});

export default App;




// import React, { useEffect, useState } from 'react';
// import {
//   SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, ActivityIndicator, View, Platform, TextInput, TouchableOpacity, Alert
// } from 'react-native';

// import { PermissionsAndroid } from 'react-native';
// import WifiManager from "react-native-wifi-reborn";
// import NetInfo from "@react-native-community/netinfo";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { retrieveItem, storeItem } from './src/utils/functions';
// import DropdownAlert from 'react-native-dropdownalert';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';


// const audioRecorderPlayer = new AudioRecorderPlayer();

// const App = () => {

//   const [recordSecs, setRecordSecs] = useState();
//   const [recordTime, setRecordTime] = useState();

//   const [currentPositionSec, setCurrentPositionSec] = useState();
//   const [currentDurationSec, setCurrentDurationSec] = useState();
//   const [playTime, setPlayTime] = useState();
//   const [duration, setDuration] = useState();

//   async function getPermissions() {
//     if (Platform.OS === 'android') {
//       try {
//         const grants = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         ]);

//         console.log('write external stroage', grants);

//         if (
//           grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
//           PermissionsAndroid.RESULTS.GRANTED &&
//           grants['android.permission.READ_EXTERNAL_STORAGE'] ===
//           PermissionsAndroid.RESULTS.GRANTED &&
//           grants['android.permission.RECORD_AUDIO'] ===
//           PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.log('Permissions granted');
//         } else {
//           console.log('All required permissions not granted');
//           return;
//         }
//       } catch (err) {
//         console.warn(err);
//         return;
//       }
//     }
//   }


//   async function onStartRecord() {
//     const result = await audioRecorderPlayer.startRecorder();
//     audioRecorderPlayer.addRecordBackListener((e) => {

//       setRecordSecs(e.currentPosition);
//       setRecordTime(audioRecorderPlayer.mmssss());
//       return;
//     });
//     console.log(result);
//   };

//   async function onStopRecord() {
//     const result = await audioRecorderPlayer.stopRecorder();
//     audioRecorderPlayer.removeRecordBackListener();
//     setRecordSecs(0);
//   }

//   const onStartPlay = async () => {
//     console.log('onStartPlay');
//     const msg = await audioRecorderPlayer.startPlayer();
//     console.log('msg', msg);
//     audioRecorderPlayer.addPlayBackListener((e) => {
//       setCurrentPositionSec(e.currentPosition);
//       setCurrentDurationSec(e.duration);
//       setPlayTime(this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//       setDuration(this.audioRecorderPlayer.mmssss(Math.floor(e.duration)));
//       return;
//     });
//   };

//   // onPausePlay = async () => {
//   //   await this.audioRecorderPlayer.pausePlayer();
//   // };

//   // onStopPlay = async () => {
//   //   console.log('onStopPlay');
//   //   this.audioRecorderPlayer.stopPlayer();
//   //   this.audioRecorderPlayer.removePlayBackListener();
//   // };


//   useEffect(() => {
//     getPermissions();
//     // onStartRecord();
//     // onStopRecord();
//     onStartPlay();

//   }, [])
// }



// // const App = () => {


// //   const [askGetWifiInfo, setAskGetWifiInfo] = useState(false);
// //   const [currentSsid, setCurrentSsid] = useState('');
// //   const [currentSsidPass, setCurrentSsidPass] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   let alertRef;



// //   async function connectWifiManually() {
// //     setLoading(true)
// //     let granted = true;
// //     if (Platform.OS == 'android') {
// //       granted = getLocationPermission();
// //     }
// //     if (granted) {
// //       const localWifiList = await retrieveItem('wifi_list');
// //       console.log('wifiList', localWifiList[0]);
// //       if (localWifiList[0]?.ssid && localWifiList[0]?.password) {
// //         WifiManager.connectToProtectedSSID(localWifiList.ssid, localWifiList.password, false)
// //           .then(
// //             () => {
// //               setLoading(false)
// //               alertRef.alertWithType("success", "Connected", '');
// //               console.log("connectToProtectedSSID successfully!");
// //             },
// //             (reason) => {
// //               setLoading(false)
// //               alertRef.alertWithType("error", "Error", 'Error connecting to internet');
// //               console.log("connectToProtectedSSID failed!");
// //               console.log(reason);
// //             }
// //           );
// //       }

// //     }
// //     setLoading(false)


// //   }

// //   async function getLocationPermission() {
// //     const granted = await PermissionsAndroid.request(
// //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //       {
// //         title: 'Location permission is required for WiFi connections',
// //         message:
// //           'This app needs location permission as this is required  ' +
// //           'to scan for wifi networks.',
// //         buttonNegative: 'DENY',
// //         buttonPositive: 'ALLOW',
// //       },
// //     );
// //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //       return true
// //     }
// //     else return false
// //   }

// //   async function getCurrentWifiSSID() {

// //     let granted = true;
// //     if (Platform.OS == 'android') granted = await getLocationPermission();
// //     if (granted) {
// //       const ssid = await WifiManager.getCurrentWifiSSID()
// //       return ssid;
// //     } else {
// //       // PERMISSION DENIED IN ANDROID
// //     }

// //   }

// //   async function addWifiToDb() { // LOCAL DB

// //     setLoading(true);
// //     if (currentSsid && currentSsidPass) {
// //       const list = {
// //         ssid: currentSsid,
// //         password: currentSsidPass
// //       };
// //       setLoading(false);
// //       storeItem('wifi_list', list); // STORE WIFI INFO IN ASYNC STORAGE
// //       setAskGetWifiInfo(false);
// //       alertRef.alertWithType("success", "Success", 'Network Added');
// //     }
// //     else {
// //       alertRef.alertWithType("error", "Error", 'Please enter network password');
// //     }
// //     setLoading(false);
// //   }




// //   useEffect(() => {


// //     setLoading(true)
// //     // subscribe to get netinfo state
// //     const unsubscribeNetInfo = NetInfo.addEventListener(async state => {
// //       if (state.isConnected) {  // CHECK THAT WE HAVE THIS SSID IN OUR DATABASE OR NOT, IF NOT THEN ASK USER FOR PASSWORD AND STORE IN DATABASE
// //         retrieveItem('wifi_list') // GET WIFI LIST FROM ASYNC STORAGE
// //           .then(async data => {
// //             const ssid = await getCurrentWifiSSID();
// //             if (ssid) {
// //               if (!data || data?.ssid != ssid) {
// //                 setCurrentSsid(ssid);
// //                 setAskGetWifiInfo(true)
// //               }
// //             }
// //           })
// //       }
// //       else {
// //         connectWifiManually(); // WIFI IS NOT CONNECTED TRY TO MANUALLY CONNECT;
// //       }
// //     });
// //     setLoading(false);
// //     return unsubscribeNetInfo;
// //   }, [])







// //   return (
// //     <SafeAreaView style={{ backgroundColor: '#111111', flex: 1, paddingHorizontal: 20 }} >
// //       <DropdownAlert ref={(ref) => alertRef = ref} />
// //       {loading && <ActivityIndicator color={"white"} size={"large"} />}
// //       {askGetWifiInfo ?
// //         // VIEW TO GET NETWORK PASSWORD FROM USER
// //         <View style={{ height: "100%", flex: 1 }}>
// //           <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 30, alignSelf: 'center', fontSize: 17, fontWeight: 'bold' }}>Save Wifi Network</Text>
// //           <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 30, }}>Wifi Name</Text>
// //           <TextInput
// //             placeholder='Wifi ssid'
// //             style={{ marginTop: 10, borderRadius: 10, color: '#E2B378', paddingLeft: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' }}
// //             placeholderTextColor='#E2B378'
// //             value={currentSsid}
// //             editable={false}
// //           />
// //           <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 15, }}>Wifi Password</Text>
// //           <TextInput
// //             style={{ borderRadius: 10, color: 'white', paddingLeft: 10, marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' }}
// //             placeholderTextColor='rgba(255,255,255,0.8)'
// //             placeholder='Password'
// //             onChangeText={(t) => {
// //               setCurrentSsidPass(t)
// //             }}
// //           />
// //           <TouchableOpacity
// //             onPress={() => {
// //               addWifiToDb()
// //             }}
// //             style={{ backgroundColor: '#E2B378', borderRadius: 10, marginTop: 50, width: 100, height: 48, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
// //             <Text style={{ color: '#111111', }}>Save</Text>
// //           </TouchableOpacity>

// //         </View>

// //         :
// //         <Text style={{ color: 'white', marginTop: 200, alignSelf: 'center', fontSize: 18 }}>Current Network: {currentSsid}</Text>
// //       }
// //     </SafeAreaView>
// //   );
// // };


// export default App;


