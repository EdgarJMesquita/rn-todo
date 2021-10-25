import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, AlertButton } from 'react-native';
import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function handleAddTask(newTaskTitle: string) {
    if(tasks.findIndex(item=>item.title===newTaskTitle) > 0){
      Alert.alert('Task já cadastrada','Você não pode cadastrar uma task com o mesmo nome.')
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      done: false
    }
    const updatedTasks = [...tasks, newTask];
    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);

  }

  async function handleToggleTaskDone(id: number) {
    const updatedTasks = tasks.map(task=>task.id===id?{ ...task, done: !task.done }:{...task});
    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  }

  async function handleEdit(id: number ,title: string) {
    const updatedTasks = tasks.map(task=>task.id===id? { ...task, title: title }:{...task});
    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  }


  async function handleRemoveTask(id: number) {
    Alert.alert(
      'Remover item', 
      'Tem certeza que deseja remover o item?', 
      [
        {
          text: 'Não',
          style: 'cancel' 
        },
        {
          text: 'Sim',
          onPress: async()=>{
            const updatedTasks = tasks.filter(task=>task.id!==id);
            await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
          }
        }
      ]
    )
  }

  useEffect(() => {
    (async()=>{
      const storage = await AsyncStorage.getItem('@tasks');
      setTasks(storage? JSON.parse(storage):[]);
    })();

  }, [])

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      <TasksList 
        tasks={tasks} 
        toggleTaskDone={handleToggleTaskDone}
        removeTask={handleRemoveTask}
        handleEdit={handleEdit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB'
  }
})