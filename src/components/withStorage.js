import { AsyncStorage } from 'react-native';

export const getToken =  async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value;
    // console.log(key, ":", value);
}

export const isUserAuthenticated = async () => await AsyncStorage.getItem('txId');

export const setToken = async (tokenId, userId, userdataId) => {
    const token = await AsyncStorage.setItem("txId", tokenId);
    const user = await AsyncStorage.setItem("uxId", userId);
    const userData = await AsyncStorage.setItem("udxId", userdataId);
    return "All values are saved";
}

export const removeToken = async (tokenId, userId, userdataId) => {
    await AsyncStorage.removeItem("txId");
    await AsyncStorage.removeItem("uxId");
    await AsyncStorage.removeItem("udxId");
    return "All values are deleted";
}
 