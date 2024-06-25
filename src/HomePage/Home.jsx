import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import "./Home.css";
import { useFormik } from "formik";
import { ToDoListSchema } from "../schemas";
import { IoCalendarNumberOutline } from "react-icons/io5";

const initialValues = {
  list: "",
  dueDate: "",
};

const Home = () => {
  const { values, errors, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: ToDoListSchema,
      onSubmit: async (values, { resetForm }) => {
        try {
          await axios.post(
            "https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data",
            {
              list: values.list,
              dueDate: values.dueDate, 
            }
          );
          readData();
          resetForm();
        } catch (error) {
          console.error("Error adding data: ", error);
        }
      },
    });

  const [data, setData] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(
    JSON.parse(localStorage.getItem("completedTasks")) || {}
  );
  const [editingDescriptionItemId, setEditingDescriptionItemId] = useState(null);
  const [editedDescriptions, setEditedDescriptions] = useState({});
  const [editingDueDateItemId, setEditingDueDateItemId] = useState(null); 
  const [editedDueDates, setEditedDueDates] = useState({}); 

  const readData = async () => {
    try {
      const response = await axios.get(
        "https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    readData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`
      );
      readData();

      setCompletedTasks((prev) => {
        const updated = { ...prev };
        delete updated[id];
        localStorage.setItem("completedTasks", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleTick = (id) => {
    setCompletedTasks((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("completedTasks", JSON.stringify(updated));
      return updated;
    });
  };

  const setToLocalStorage = (id, list) => {
    localStorage.setItem("id", id);
    localStorage.setItem("list", list);
  };

  const updateDescription = async (id, updatedDescription) => {
    try {
      await axios.put(
        `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`,
        { description: updatedDescription }
      );
      readData();
    } catch (error) {
      console.error("Error updating description: ", error);
    }
  };

  const updateDueDate = async (id, updatedDueDate) => {
    try {
      await axios.put(
        `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`,
        { dueDate: updatedDueDate }
      );
      readData();
    } catch (error) {
      console.error("Error updating due date: ", error);
    }
  };

  const handleToggleDescriptionEdit = (id) => {
    setEditingDescriptionItemId((prevId) => (prevId === id ? null : id));
    if (id === editingDescriptionItemId) {
      if (editedDescriptions[id]) {
        updateDescription(id, editedDescriptions[id]);
        setEditedDescriptions((prev) => ({
          ...prev,
          [id]: undefined,
        }));
      }
    }
  };

  const handleToggleDueDateEdit = (id) => {
    setEditingDueDateItemId((prevId) => (prevId === id ? null : id));
    if (id === editingDueDateItemId) {
      if (editedDueDates[id]) {
        updateDueDate(id, editedDueDates[id]);
        setEditedDueDates((prev) => ({
          ...prev,
          [id]: undefined,
        }));
      }
    }
  };

  const handleDescriptionChange = (id, value) => {
    setEditedDescriptions((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDueDateChange = (id, value) => {
    setEditedDueDates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="notification-icon">
          <IoMdNotifications />
        </div>
        <h2 className="morning">Morning</h2>
        <h1>TO - DO LIST</h1>

        <div className="div-1">
          <input
            type="text"
            className="box"
            placeholder="What do you want to do?"
            name="list"
            value={values.list}
            onChange={handleChange}
            onBlur={handleBlur}
          />
       
          <button type="submit" className="btn">
            ADD
          </button>
        </div>
        {errors.list ? (
          <div className="form-error">{errors.list}</div>
        ) : null}

        <div className="contain">
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                <div className="container-2">
                  <span>{item.list}</span>
                  <p className="des">{item.description}</p>
                  <p className="due-date">
                    {item.dueDate ? `${item.dueDate}` : "No due date set"}
                  </p>
                </div>
                <div className="buttons">
                  {editingDescriptionItemId === item.id ? (
                    <div className="description-container">
                      <input
                        type="text"
                        className="description-input"
                        value={
                          editedDescriptions[item.id] || item.description
                        }
                        onChange={(e) =>
                          handleDescriptionChange(item.id, e.target.value)
                        }
                      />
                      <button
                        className="save-description-btn"
                        onClick={() => handleToggleDescriptionEdit(item.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={`/description/edit/${item.id}`} 
                      className="edit-description-link"
                    >
                      <MdEdit className="icon-d"/>
                    </Link>
                  )}
                  {editingDueDateItemId === item.id ? (
                    <div className="due-date-container">
                      <input
                        type="date"
                        className="due-date-input"
                        value={editedDueDates[item.id] || item.dueDate}
                        onChange={(e) =>
                          handleDueDateChange(item.id, e.target.value)
                        }
                      />
                      <button
                        className="save-due-date-btn"
                        onClick={() => handleToggleDueDateEdit(item.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      
                      onClick={() => handleToggleDueDateEdit(item.id)}
                    >
                     <IoCalendarNumberOutline className="icon-c"/>
                    </button>
                  )}
                  <button
                    className={`done ${
                      completedTasks[item.id] ? "completed" : ""
                    }`}
                    onClick={() => handleTick(item.id)}
                    type="button"
                  >
                    <i className="tick"></i>
                  </button>
                  <button onClick={() => handleDelete(item.id)} type="button">
                    <MdDeleteForever className="icons" />
                  </button>
                  <Link to="/edit">
                    <button
                      onClick={() =>
                        setToLocalStorage(item.id, item.list)
                      }
                      className="btn-update"
                      type="button"
                    >
                      Edit
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        

        </div>
      </form>
    </>
  );
};

export default Home;
