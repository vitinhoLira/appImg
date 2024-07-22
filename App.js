
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, deleteObject, list } from "firebase/storage";



const ImagePickerExample = () => {
  const [imageUri, setImageUri] = useState("https://previews.123rf.com/images/mironovak/mironovak1508/mironovak150800047/44239635-textura-de-tela-branca-ou-textura-de-padr%C3%A3o-de-grade-de-linho.jpg");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState([null]);
  const [visible, setVisible] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyBfdwcc_4BF3-G001yKm85QWTO5yLR1chQ",
    authDomain: "atvd-deleteimg.firebaseapp.com",
    projectId: "atvd-deleteimg",
    storageBucket: "atvd-deleteimg.appspot.com",
    messagingSenderId: "263899144896",
    appId: "1:263899144896:web:192defcdb9b80b63280325"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


  //Armazena a imagem para o upload e exibe a imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.assets);
    }
  };

  function getRandom(max) {
    return Math.floor(Math.random() * max + 1)
  }



  //Método para realizar upload para o Firebase
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Selecione uma imagem antes de enviar.');
      return;
    }

    // Create a root reference
    const storage = getStorage();

    var name = getRandom(200);
    // Create a reference to 'mountains.jpg'
    const mountainsRef = ref(storage, name + '.jpg');

    const response = await fetch(imageUri);
    const blob = await response.blob();

    uploadBytes(mountainsRef, blob).then((snapshot) => {
      console.log(snapshot);
      alert('Imagem enviada com sucesso!!');
    });
  };


  //Listar no console as imagens salvas no storage
  async function LinkImage() {
    // Create a reference under which you want to list
    const storage = getStorage();
    const listRef = ref(storage);

    // Fetch the first page of 100.
    const firstPage = await list(listRef, { maxResults: 100 });
    var lista = [];
    firstPage.items.map((item) => {

      var link = ('https://firebasestorage.googleapis.com/v0/b/' +
        item.bucket + '/o/' + item.fullPath + '?alt=media');
      lista.push(link);

    })
    setImage(lista);
    setVisible(true);
    console.log(image);
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.link}</Text>
    </View>
  );

  async function deleteImg(img) {

    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, img);

    //Delete the file
    deleteObject(desertRef).then(() => {
      // File deleted successfully
      alert('Imagem excluída com sucesso!!');
    }).catch((error) => {
      //  Uh-oh, an error occurred!
      alert('Erro: ' + error);
    });

  }

  return (
<View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={pickImage}>
        <Text style={styles.botaoTexto}>Escolher Imagem</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.botao} onPress={uploadImage}>
          <Text style={styles.botaoTexto}>Enviar Imagem</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.botao} onPress={LinkImage}>
        <Text style={styles.botaoTexto}>Ver Imagens</Text>
      </TouchableOpacity>

      <FlatList
        data={image}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.imageThumbnail} />
            <TouchableOpacity style={styles.botao} onPress={() => deleteImg(item)}>
              <Text style={styles.botaoTexto}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#DCDCDC"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "#9ACD32",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 5, 
    borderRadius: 5,
    alignItems: 'center'
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    marginHorizontal: 10 
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  imageThumbnail: {
    width: 50,
    height: 50,
    marginRight: 10
  }
});

export default ImagePickerExample;
