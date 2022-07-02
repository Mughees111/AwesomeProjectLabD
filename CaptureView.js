import React, {memo, useEffect, useRef, useState} from 'react';
import {Button, PermissionsAndroid, StyleSheet, Text} from 'react-native';
import {mediaDevices, RTCView} from 'react-native-webrtc';

function CaptureView({isFront}) {
  const [capture, setCapture] = useState(null);
  const captureRef = useRef(null);


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


  useEffect(() => {
    onCapture();
  }, []);

  console.log('capture', capture);
  console.log(capture?._tracks);

  const onCapture = async () => {
    if (!capture) {
      let capturing;
      const constraints = {
        video: true,
      };
      try {
        capturing = await mediaDevices.getUserMedia(constraints);
        setCapture(capturing);
      } catch (error) {
        console.error(error);
      }
    } else {
      capture.getTracks().forEach(track => track.stop());
      setCapture(null);
    }
  };

  const onEnd = () => {
    capture?.release();
    setCapture(null);
  };

  return (
    <>
      <Text>Capture View</Text>
      {capture && (
        <RTCView
          ref={captureRef}
          streamURL={capture?.id}
          style={styles.flexChildren}
          mirror={isFront ? true : false}
        />
      )}
      <Button
        title={capture ? 'Stop' : 'Capture'}
        onPress={() => {
          capture ? onEnd() : onCapture();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flexChildren: {
    flex: 1,
  },
});

export default memo(CaptureView);