import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { ItemWrapper } from './ItemWrapper';
import Icon from 'react-native-vector-icons/Feather';
import trashIcon from '../assets/icons/trash/trash.png'
import Pen from '.././assets/icons/Pen.png';
import X from '.././assets/icons/X.png';

type Task = {
  id: number;
  title: string;
  done: boolean;
}

type Props = {
  task: Task;
  index: number;
  toggleTaskDone: (id: number) => void;
  removeTask: (id: number) => void;
  handleEdit: (id: number, title:string) => void;
}

export function TaskItem({task,index,toggleTaskDone,removeTask, handleEdit}:Props) {
  const [isEditting, setIsEditting] = useState(false);
  const [edittingTask, setEdittingTask] = useState(task.title)
  const input = useRef<TextInput>(null);

  function handleEditing(){
    if(!isEditting){
      setIsEditting(true);

    } else {
      setIsEditting(false);

    }
  }

  function confirmEditting(){
    handleEdit(task.id, edittingTask);
  }

  useEffect(() => {
    if(isEditting){
      input.current?.focus();
    }
  }, [isEditting])

  return (
    <ItemWrapper index={index}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          testID={`button-${index}`}
          activeOpacity={0.7}
          style={styles.taskButton}
          onPress={()=>toggleTaskDone(task.id)}
        >
          <View 
            testID={`marker-${index}`}
            style={task.done? styles.taskMarkerDone : styles.taskMarker }
          >
            { task.done && (
              <Icon 
                name="check"
                size={12}
                color="#FFF"
              />
            )}
          </View>

          <TextInput 
            ref={input}
            value={edittingTask}
            onChangeText={setEdittingTask}
            style={[task.done? styles.taskTextDone :styles.taskText, {padding: 0}]}
            editable={isEditting}
            onSubmitEditing={confirmEditting}
            onBlur={handleEditing}
          />
        </TouchableOpacity>
      </View>

      
      <TouchableOpacity
        onPress={handleEditing}
      >
        {
          isEditting?
          <Image 
            source={X}
            style={{width: 20, height: 20}}
          />
          :
          <Image 
            source={Pen}
            style={{width: 27, height: 27}}
          />
        }
      </TouchableOpacity>

      <View style={{width: 1, height: '60%', backgroundColor: '#C4C4C4', marginHorizontal: 20}} />
        
      <TouchableOpacity
        testID={`trash-${index}`}
        style={{marginRight: 29, opacity: isEditting? 0.2: 1}}
        onPress={()=>removeTask(task.id)}
        disabled={isEditting}
      >
        <Image source={trashIcon} />
      </TouchableOpacity>
    </ItemWrapper>
  )
}

const styles = StyleSheet.create({
  taskButton: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 15,
    marginBottom: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskMarker: {
    height: 16,
    width: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskText: {
    color: '#666',
    fontFamily: 'Inter-Medium'
  },
  taskMarkerDone: {
    height: 16,
    width: 16,
    borderRadius: 4,
    backgroundColor: '#1DB863',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskTextDone: {
    color: '#1DB863',
    textDecorationLine: 'line-through',
    fontFamily: 'Inter-Medium'
  }
})