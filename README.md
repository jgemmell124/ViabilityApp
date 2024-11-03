#### how to start

###### install expo



######
build the project

First you must set up SDK
install cli tools for android SDK
(platform-tools, build-tools, cmdline-tools)
must also add path to .bashrc


if failing to build, may have to run
npx expo-doctor to update dependencies


to start the project
```
$ npx expo start
```
to clear cache and start
```
$ npx expo start --clear
```
then make sure it is in development mode



### build apk
```
eas build -p android --profile preview
```

then download to device




#### debug issues
Expo Go does not work with the BLE library,
so you must build in develpment mode

https://stackoverflow.com/questions/77925734/react-native-typeerror-cannot-read-property-createclient-of-null

could try
```
npx expo run:android to build
```


#### latest build

https://expo.dev/artifacts/eas/21BfnRDv9dLDUqiz3ZTu8F.apk
