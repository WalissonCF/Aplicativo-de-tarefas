import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';

const AnimateBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  // Mantendo as tarefas salvas - Buscando tarefas ao iniciar o app
  useEffect(() => {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem('@task');

      if(taskStorage){
        setTask(JSON.parse(taskStorage));
      }
    }

    loadTasks();

  }, []);

  // Monitorando se existe alguma tarefa nova
  useEffect(() => {
    async function saveTasks() {
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }

    saveTasks();

  }, [task]);

  function handleAdd() {
    if(input === '') return;

    const data = {
      key: input,
      task: input,
    };

    setTask([...task, data]);
    setOpen(false);
    setInput('');
  }

  const handleDelete  = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  })

  return(
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#171d31" barStyle="light-content"/>
      <View style={styles.content}>
        <Text style={styles.title}>My tasks</Text>
      </View>
      <FlatList
      marginHorizontal={10}
      showsHorizontalScrollIndicator={false}
      data={task}
      keyExtrator={ (item) => String(item.key) }
      renderItem={ ({ item }) => <TaskList data={item} handleDelete={handleDelete} /> }
      />
      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={ () => setOpen(false) }>
              <Ionicons style={{marginLeft: 10, marginRight: 5, marginTop: 10}} name="md-arrow-back" size={35} color="#FFF"/>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New task</Text>
          </View>
          <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver>
            <TextInput
            multiline={true}
            autoCorrect={false}
            placeHolderTextColor="#747474"
            placeholder="What do you need to do today?"
            style={styles.input}
            value={input}
            onChangeText={ (text) => setInput(text) }
            />
            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Register</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>
      <AnimateBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={2000}
      onPress={ () => setOpen(true) }
      >
        <Ionicons name="ios-add" size={35} color="#FFF"/>
      </AnimateBtn>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#171d31',
  },
  title:{
    marginTop: 20,
    paddingBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    color: '#FFF'
  },
  fab:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 90,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    }
  },
  modal:{
    flex: 1,
    backgroundColor: '#171d31',
  },
  modalHeader:{
    marginLeft: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle:{
    marginLeft: 10,
    marginTop: 5,
    fontSize: 20,
    color: '#FFF',
  },
  modalBody:{
    marginTop: 15,
  },
  input:{
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    backgroundColor: '#FFF',
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    borderRadius: 18,
    color: '#000'
  },
  handleAdd:{
    backgroundColor: '#FFF',
    marginTop: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    height: 40
  },
  handleAddText:{
    fontSize: 18,
  }
});