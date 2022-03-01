function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

// App Code
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const RECEIVE_DATA = "RECEIVE_DATA";

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
  };
}

function handleInitialData() {
  return (dispatch) => {
    return Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
      ([todos, goals]) => {
        dispatch(receiveDataAction(todos, goals));
      }
    );
  };
}

const handleAddTodo = (name, cb) => {
  return (dispatch) => {
    return API.saveTodo(name)
      .then((todo) => {
        dispatch(addTodoAction(todo));
        cb();
      })
      .catch(() => {
        alert("An error occured");
      });
  };
};

const handleToggle = (id) => {
  return (dispatch) => {
    dispatch(toggleTodoAction(id));

    return API.saveTodoToggle(id).catch(() => {
      dispatch(toggleTodoAction(id));
      alert("An error occurred. Try again.");
    });
  };
};

const handleDeleteTodo = (todo) => {
  return (dispatch) => {
    dispatch(removeTodoAction(todo.id));

    return API.deleteTodo(todo.id).catch(() => {
      dispatch(addTodoAction(todo));
      alert("An error occured. Try again.");
    });
  };
};

const handleAddGoal = (name, cb) => {
  return (dispatch) => {
    return API.saveGoal(name)
      .then((goal) => {
        dispatch(addGoalAction(goal));
        cb();
      })
      .catch(() => alert("There was an error. Try again."));
  };
};

const handleDeleteGoal = (goal) => {
  return (dispatch) => {
    dispatch(removeGoalAction(goal));

    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoalAction(goal));
      alert("An error occured");
    });
  };
};

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    case RECEIVE_DATA:
      return action.todos;
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}

function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("اوعى");
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("الملاحة والملاحة");
  }

  return next(action);
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log(`The action:`, action);
  const result = next(action);
  console.log(`The new state: `, store.getState());
  console.groupEnd();
  return result;
};

const onAdd = (store) => (next) => (action) => {
  // if (action.type === ADD_TODO) alert("Don't forget to " + action.todo.name);
  // if (action.type === ADD_GOAL) alert("That's a great goal!");
  return next(action);
};

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading,
  }),
  Redux.applyMiddleware(ReduxThunk.default, checker, logger, onAdd)
);

// store.dispatch(
//   addTodoAction({
//     id: 0,
//     name: "Walk the dog",
//     complete: false,
//   })
// );

// store.dispatch(
//   addTodoAction({
//     id: 1,
//     name: "Wash the car",
//     complete: false,
//   })
// );

// store.dispatch(
//   addTodoAction({
//     id: 2,
//     name: "Go to the gym",
//     complete: true,
//   })
// );

// store.dispatch(removeTodoAction(1));

// store.dispatch(toggleTodoAction(0));

// store.dispatch(
//   addGoalAction({
//     id: 0,
//     name: "Learn Redux",
//   })
// );

// store.dispatch(
//   addGoalAction({
//     id: 1,
//     name: "Lose 20 pounds",
//   })
// );

// store.dispatch(removeGoalAction(0));
function addTodo() {
  const input = document.querySelector("#todo");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addTodoAction({
      name,
      complete: false,
      id: generateId(),
    })
  );
}

const addGoal = () => {
  const input = document.querySelector("#goal");
  const name = input.value;
  input.value = "";
  store.dispatch(
    addGoalAction({
      name,
      id: generateId(),
    })
  );
};
