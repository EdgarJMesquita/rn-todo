import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function handleAddTask(newTaskTitle: string) {
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

  async function handleRemoveTask(id: number) {
    const updatedTasks = tasks.filter(task=>task.id!==id);
    await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
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