import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Edit = () => {
  const [id, setId] = useState(0);
  const [list, setList] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setId(localStorage.getItem("id"));
    setList(localStorage.getItem("list"));
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`, {
        list: list,
      })
      .then(() => {
        navigate("/");
      });
  };

  return (
    <div className="edit-container">
      <form className="form" onSubmit={handleUpdate}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={list}
            onChange={(e) => setList(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-edit">
          Update
        </button>
      </form>
    </div>
  );
};

export default Edit;
