/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Contacts from 'react-native-contacts';
import asImage from './as.png';
import star from './b.png';
import unstar from './a.png';
import error from './c.png';
import { Dimensions } from 'react-native';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,TextInput,TouchableOpacity,Image,useColorScheme,View,PermissionsAndroid,Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [record, setr] = useState([]);
  const [search,setsearch]=useState(true);
  const [btn,setbtn]=useState(true);
  const [contactarray, setcnt] = useState([]);
  const [array, setArray] = useState([]);
  const [inputText, setInputText] = useState('');
  let asd=true;
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const fetchContactsCount = async () => {
      
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
      );
  
      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        const count = await Contacts.getCount();
        if (count !== 0) {
          Contacts.getAll()
            .then(contacts => {
              contacts.sort((a, b) =>
              a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
              //a.displayName.toLowerCase() > b.displayName.toLowerCase()
              );
              setr(contacts);
              setcnt(contacts);
              
              setArray([]);
              contacts.forEach((item) => {
                // if (contacts[sum]['displayName'] === 'mummy') {
                //   console.log(contacts[sum]);
                // }
                
                if (item.note=='true') {
                  setArray(prevArray => [...prevArray, item]); // Update the array state
                }
              });
              
            })
            .catch(e => {
              alert('Permission to access contacts was denied');
              console.warn('Permission to access contacts was denied');
            });
        }
      } else if (permission === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Permission denied by user.');
      } else if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission denied by user and cannot be requested again.');
      }

    } catch (error) {
      console.log('Error requesting permission:', error);
    }
  };
  useEffect(() => {
    fetchContactsCount();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,//navigation change hoga
    height:screenHeight,
    
  };
  function handleSearch(text) {
    setInputText(text);
    if (text.length) {
      setsearch(false);
      Contacts.getContactsMatchingString(text)
        .then(contacts => {
          contacts.sort((a, b) =>
            a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
          );
          setbtn(true);
          setr(contacts);
          
        })
        .catch(e => {
          alert('Permission to access contacts was denied');
          console.warn('Permission to access contacts was denied');
        });
    }  
    else setsearch(true);
  }

  function handlebtn(text){
    if(text){setr(contactarray);setbtn(true);}
    else {
      array.sort((a, b) =>
            a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
          );
          setr(array);
          setbtn(false);
          setsearch(true);
          setInputText('');
        }
  }
  const handleAlert = (a,s,d) => {
    Alert.alert(
      'Name:'+s,
      'Number:'+(d && d.length > 0)?d[0].number:'NULL', 
       
      [
        { text: 'Close', style: 'cancel' },
      ]
    );
    

  };
 const colorss=['#95b4f3','#fdb687','#8da3e3','#86d8f9','#87cbbe','#eda1a2','#6dc3b8','#fffbe0','#eaa095','#86d8f9'];
 const updateExistingContact = async (item, updatedFields) => {
    console.log(typeof item,typeof updatedFields);
    let arr;
    await record.forEach((element) => {
        if (element['recordID'] == item) {
            arr=element;
            arr.note=updatedFields;
            }
              });
    Contacts.updateContact(arr);
    fetchContactsCount();
  };
 return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      

      <View style={styles.header}>
        {btn?<View style={styles.btn}>
        <TouchableOpacity  style={styles.button1ON}>
          <Text style={{color:'#ffffff'}}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress = {() => handlebtn(0)} style={styles.button2OF}>
        <Text style={{color:'#ffffff'}}>stared</Text>
        </TouchableOpacity>
        </View>:<View style={styles.btn}>
        <TouchableOpacity onPress = {() => handlebtn(1)} style={styles.button1OF}>
          <Text style={{color:'#ffffff'}}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.button2ON}>
        <Text style={{color:'#ffffff'}}>stared</Text>
        </TouchableOpacity>
        </View>}
        </View>
        
        {search && <View  style={styles.search}>
        <Image source={asImage} style={{width:20,height:20,alignSelf:'center',marginStart:15}} />
        </View>}
        <TextInput style = {styles.search}
               underlineColorAndroid = "transparent"
               placeholder = "                                 Search"
               value={inputText}
               placeholderTextColor = "#3C3C47"
               autoCapitalize = "none"
               onChangeText = {text => handleSearch(text)}/>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.bkd}>
      {(record.length)?<View>{record.map(item => (
  <TouchableOpacity key={item.recordID} onPress = {() => handleAlert(item.recordID,item.displayName,item.phoneNumbers)} style={styles.container}>
    {item.hasThumbnail ?
      <Image source={{ uri: item.thumbnailPath }} style={{ width: 40, height: 40, borderRadius: 20 }} />
      :
      <View style={{ backgroundColor:colorss[item.displayName.length%10], ...styles.circle }}><Text>{item.displayName[0]}</Text></View>
    }
    <Text style={styles.text}>{item.displayName}</Text>
    {item.phoneNumbers && item.phoneNumbers.length > 0 && (
      <Text style={styles.text}>{item.phoneNumbers[0].number}</Text>
    )}
    {item.note=='true'?btn && <TouchableOpacity onPress = {() => updateExistingContact(item.recordID,'false')} style={{zIndex:1,paddingTop:6}}>
    <Image source={star} style={{width:20,height:20,alignSelf:'center'}} />
        </TouchableOpacity>:

btn && <TouchableOpacity onPress = {() => updateExistingContact(item.recordID,'true')} style={{zIndex:1,paddingTop:6}}>
        <Image source={unstar} style={{width:20,height:20,alignSelf:'center'}} />
      </TouchableOpacity>}
  </TouchableOpacity>
   ))}</View>:<View ><Image source={error} style={{width:screenWidth,height:(screenHeight-160)}} /></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flexDirection: 'row',
  alignContent: 'center',
  backgroundColor: '#151620',
  height: 47,
  paddingLeft: 10,
  paddingTop:7,
  marginBottom: 2,
  },
  bkd:{
    backgroundColor:'#151620',
  },
  text: {
    color: '#ffffff',
    width: 145,
    paddingTop: 8,
    paddingLeft:10,
  },
  text2: {
    color: '#ffffff',
    width: 40,
    paddingTop: 8,
    
    
  },
  header: {
    height: 160,
    flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
    backgroundColor:'#151620',    
  },
  search:{
    width:300,
    height:40,
    borderWidth: 1,
    borderColor:'#3c3c47',
    flexDirection: 'row',
    
    borderRadius: 25,
    position:'absolute',
    marginTop:100,
    marginLeft:40,
  },
  btn: {
    height: 70,
    paddingTop:30,
    width:180,
    backgroundColor:'#151620',
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  circle: {
    
    flexDirection: 'row',
    paddingTop:10,
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  button1ON:{
    backgroundColor:"#4b53ff",
    height: 40,
    paddingLeft:30,
    paddingTop:10,
    width: 80,
    borderRadius: 20,
  },
  button2ON:{
    
    height: 40,
    backgroundColor:"#4b53ff",
    paddingLeft:20,
    paddingTop:10,
    width: 80,
    borderRadius: 20,
  },
  button1OF:{
    
    borderWidth: 1,
    borderColor:'#3c3c47',
    height: 40,
    paddingLeft:30,
    paddingTop:10,
    width: 80,
    borderRadius: 20,
  },
  button2OF:{
    
    height: 40,
    borderWidth: 1,
    borderColor:'#3c3c47',
    paddingLeft:20,
    paddingTop:10,
    width: 80,
    borderRadius: 20,
  },
  
  
});

export default App;
