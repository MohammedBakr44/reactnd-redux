const List = (props) => {
  console.log(props.items);

  return (
    <ul>
      {props.items.map((item) => {
        return (
          <li key={item.id}>
            <span
              onClick={() => props.toggle && props.toggle(item.id)}
              style={{
                textDecoration: item.complete ? "line-through" : "none",
              }}
            >
              {item.name}
            </span>
            <button onClick={() => props.remove(item)}>X</button>
          </li>
        );
      })}
    </ul>
  );
};

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    this.props.store.dispatch(
      handleAddTodo(this.input.value, () => (this.input.value = ""))
    );
  };
  removeItem = (todo) => {
    this.props.store.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = (id) => {
    this.props.store.dispatch(handleToggle(id));
  };
  render() {
    return (
      <div>
        TODOS
        <h1>Todo List</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Todo</button>
        <List
          items={this.props.todos}
          remove={this.removeItem}
          toggle={this.toggleItem}
        />
      </div>
    );
  }
}

class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    this.props.store.dispatch(
      handleAddGoal(this.input.value, () => (this.input.value = ""))
    );
  };
  removeItem = (goal) => {
    this.props.store.dispatch(handleDeleteGoal(goal));
  };
  render() {
    return (
      <div>
        Goal
        <h1>Goal List</h1>
        <input
          type="text"
          placeholder="Add Goal"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Goal</button>
        <List items={this.props.goals} remove={this.removeItem} />
      </div>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    store.subscribe(() => this.forceUpdate());

    store.dispatch(handleInitialData());
  }

  render() {
    const { store } = this.props;
    const { todos, goals, loading } = store.getState();
    if (loading === true) {
      return <h3>Loading...</h3>;
    }
    return (
      <div>
        <Todos todos={todos} store={this.props.store} />
        <Goals goals={goals} store={this.props.store} />
      </div>
    );
  }
}
ReactDOM.render(<App store={store} />, document.querySelector("#app"));
