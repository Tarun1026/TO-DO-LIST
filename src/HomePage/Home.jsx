import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [list, setList] = useState("");
  const [data, setData] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data", {
        list: list,
      });
      readData();
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`
      );
      readData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const setToLocalStorage = (id, list) => {
    localStorage.setItem("id", id);
    localStorage.setItem("list", list);
  };

  return (
    <>
      <div className="container">
        <h1>TO DO LIST</h1>
      </div>
      <div className="div-1">
        <input
          type="text"
          className="box"
          placeholder="What do you want to do?"
          onChange={(e) => setList(e.target.value)}
        />
        <button className="btn" onClick={handleSubmit}>
          ADD
        </button>
      </div>

      <div className="contain">
        <h2>To do Items:</h2>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <span>{item.list}</span>
              <div className="buttons">
                <button onClick={() => handleDelete(item.id)}>
                  <MdDeleteForever className="icons" />
                </button>
                <Link to="/edit">
                  <button
                    onClick={() => setToLocalStorage(item.id, item.list)}
                    className="btn-update"
                  >
                    Edit
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;
