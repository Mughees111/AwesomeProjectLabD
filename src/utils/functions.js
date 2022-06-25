// importing local storage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useCallback } from 'react';
// import SimpleAlert from './SimpleAlert';
import { Share } from 'react-native';
import { navigate } from '../../Navigations';




// local storage function that retreives the data
export async function retrieveItem(key) {
  try {
    const retrievedItem = await AsyncStorage.getItem(key);
    const item = JSON.parse(retrievedItem);
    return item;
  } catch (error) {
    console.log(error.message);
  }
  return
}


// store data in lcoalstorage
export async function storeItem(key, item) {
  try {
    var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
    return jsonOfItem;
  } catch (error) {
    console.log(error.message);
  }
}


