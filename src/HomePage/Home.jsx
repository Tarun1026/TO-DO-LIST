import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import "./Home.css";
import { useFormik } from "formik";
import { ToDoListSchema } from "../schemas";

const initialValues = {
  list: "",
};

const Home = () => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: ToDoListSchema,
      onSubmit: async (values, { resetForm }) => {
        try {
          await axios.post("https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data", {
            list: values.list,
          });
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
                <span>{item.list}</span>
                <div className="buttons">
                  <button
                    className={`done ${completedTasks[item.id] ? "completed" : ""}`}
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
                      onClick={() => setToLocalStorage(item.id, item.list)}
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
