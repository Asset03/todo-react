import { lastDayOfDecade } from "date-fns";
import { useState,useEffect } from "react";
import { v4 as myNewID } from "uuid";

import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

function App() {
  // it's for input our new todos
  
  const local_items = ()=>{
    let item = localStorage.getItem("user")
    if (item){
      return JSON.parse(localStorage.getItem("user"))
    }else{
      return [];
    }
  }

  

  
  const [itemToDo, setItemToDo] = useState("");
  //it's new list
  const [inputs,setInput] = useState();
  //it's our all items todo
  const [items, setItems] = useState(local_items());
 
  useEffect(() =>{
    localStorage.setItem("user",JSON.stringify(items))
  },[items])


  //it's default will display 'all' things (all,active,done)
  const [filterType, setFilterType] = useState("all");
  //it's take input'value
  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  };
  //save input's value
  const handleInputChange = (event) =>{
    const find = event.target.value.toLowerCase();
    const words = items.filter((item) => (item.label.toLowerCase().includes(find) && !item.done))
    setFilterType("search")
    setInput([...words])
    // setInput((prev) => [words,...prev])
  }
  //add new itemToDo
  const handleAddItem = () => {
    const newItem = { key: myNewID(), label: itemToDo };

    setItems((prevElement) => [newItem, ...prevElement]);

    setItemToDo("");
  };
  // make done to todo 
  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>  
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  // hw important 
  const handleItemImportant = ({key}) =>{
    setItems((prevItems) => 
      prevItems.map((item)=>{
      if(item.key === key){
        return {...item,important: !item.important};
      }else return item;
    }))
  }
  // hw remove todo
  const handleItemRemove= ({key}) =>{
    const index = items.findIndex((item) => item.key===key)
    
    const leftSide = items.slice(0,index);
    const rightSide = items.slice(index+1,items.length);

    setItems([...leftSide,...rightSide])

  }


  //stopped in here 
  const handleFilterChange = ({ type }) => {
    setFilterType(type);
  };

  const moreToDo = items.filter((item) => !item.done).length;

  const doneToDo = items.length - moreToDo;

  const filteredArray =
    filterType === "all"
      ?items
      :filterType === "done"
      ? items.filter((item) => item.done)
      :filterType==="search"
      ?inputs
      :items.filter((item) => !item.done);
    
      return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {moreToDo} more to do, {doneToDo} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleInputChange}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`btn btn-info ${
                filterType === item.type ? "" : "btn-outline-info"
              }`}
              onClick={() => handleFilterChange(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredArray.length > 0 &&
          filteredArray.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.important?"important" :""}  ${item.done ? "done" : ""}` }>
                <span
                  className={`todo-list-item-label ${item.important?"important" :""}` }
                  //call function with parameters
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  //important
                  onClick={() => handleItemImportant(item)}
                  >


                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemRemove(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;