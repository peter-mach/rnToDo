import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native'

export default class App extends Component {

  state = {
    newTodo: '',
    todos: [],
    // todos: [{text: 'task 1', done: false}, {text: 'task 2', done: false}, {text: 'task 3', done: true}, {text: 'task 1', done: false}, {text: 'task 2', done: false}, {text: 'task 3', done: true}, {text: 'task 1', done: false}, {text: 'task 2', done: false}, {text: 'task 3', done: true}],
  }

  componentWillMount() {
    AsyncStorage
      .getItem('todoItems')
      .then(todos => this.setState({ todos: JSON.parse(todos) || [] }))
  }

  addNewTodo() {
    if (this.state.newTodo === '') {
      return
    }
    const newTodos = [{text: this.state.newTodo, done: false}, ...this.state.todos]
    AsyncStorage.setItem('todoItems', JSON.stringify(newTodos))
    this.setState({
      newTodo: '',
      todos: newTodos
    })
  }

  toggleTodo(item, i) {
    const newTodos = this.state.todos.map((todoItem, idx) => idx === i ? { text: item.text, done: !item.done } : todoItem)
    AsyncStorage.setItem('todoItems', JSON.stringify(newTodos))
    this.setState({
      todos: newTodos
    })
  }

  renderTodoItem(item, i) {
    return (
      <TouchableOpacity
        key={i}
        style={styles.todoContainer}
        activeOpacity={0.5}
        onPress={() => this.toggleTodo(item, i)} >
        <Text
          style={[styles.todoText, item.done ? styles.todoTextDone : null]}
          numberOfLines={1} >
          {item.text}
        </Text>
        <View style={styles.indicatorContainer}>
          <View style={item.done ? styles.indicatorDone : styles.indicatorTodo} />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.todoInput}
          autoCorrect={false}
          autoFocus={true}
          value={this.state.newTodo}
          placeholder="what will you do?"
          onChangeText={(newTodo) => this.setState({newTodo})}
          onSubmitEditing={() => this.addNewTodo()}
          returnKeyType="done" />

        <Text style={styles.doneCounter}>
          {this.state.todos.length
            ? `${this.state.todos.reduce((sum, item) => item.done ? ++sum : sum, 0) } items done`
            : ''}
        </Text>

        <ScrollView style={styles.container}>
          {this.state.todos.map((item, i) => this.renderTodoItem(item, i))}
        </ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  todoInput: {
    height: 60,
    fontSize: 30,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  },


  todoContainer: {
    height: 50,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },

  todoText: {
    flex: 1,
    height: 50,
    lineHeight: 50,
    fontSize: 20,
    color: '#444',
  },
  todoTextDone: {
    fontSize: 15,
    color: '#ccc',
  },

  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  indicatorTodo: {
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: '#dedede',
  },
  indicatorDone: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: '#21ce94',
  },

  doneCounter: {
    textAlign: 'center',
    color: '#ccc',
  },
})
