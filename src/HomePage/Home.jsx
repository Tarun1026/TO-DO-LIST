import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { ToDoListSchema } from "../schemas";
import "./Home.css";

const initialValues = {
  list: "",
  description: "",
  dueDate: "",
};

const Home = () => {
  const [data, setData] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(
    JSON.parse(localStorage.getItem("completedTasks")) || {}
  );
  const [editingTask, setEditingTask] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const titleInputRef = useRef(null); 

  const { values, errors, handleBlur, handleChange, handleSubmit, setValues } =
    useFormik({
      initialValues: initialValues,
      validationSchema: ToDoListSchema,
      onSubmit: async (values, { resetForm }) => {
        try {
          if (editingTask) {
            await axios.put(
              `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${editingTask.id}`,
              values
            );
            setEditingTask(null);
            setAlertMessage("Task updated successfully");
          } else {
            await axios.post(
              "https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data",
              values
            );
            setAlertMessage("Task added successfully");
          }
          resetForm();
          readData();
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        } catch (error) {
          console.error("Error saving data: ", error);
        }
      },
    });

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
      setAlertMessage("Task deleted successfully");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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

  const handleEdit = (task) => {
    setEditingTask(task);
    setValues(task);
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-center">
        {showAlert && (
          <div className="alert">{alertMessage}</div>
        )}
        <div className="notification-icon">
          <IoMdNotifications />
        </div>
        <h2 className="morning">Morning</h2>
        <h1>TO - DO LIST</h1>

        <div className="div-1">
          <input
            ref={titleInputRef}
            type="text"
            className="box"
            placeholder="Title"
            name="list"
            value={values.list}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.list ? <div className="form-error">{errors.list}</div> : null}
          <input
            type="text"
            className="box"
            placeholder="Enter description..."
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.description ? (
            <div className="form-error">{errors.description}</div>
          ) : null}
          <input
            type="date"
            className="box-dueDate"
            placeholder="Due Date"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.dueDate ? (
            <div className="form-error">{errors.dueDate}</div>
          ) : null}

          <div className="btn-add">
            <button type="submit" className="btn">
              {editingTask ? "UPDATE" : "ADD"}
            </button>
          </div>
        </div>

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
                  <button
                    onClick={() => handleEdit(item)}
                    type="button"
                    className="edit-description-link"
                  >
                    <MdEdit className="icon-d" />
                  </button>
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
