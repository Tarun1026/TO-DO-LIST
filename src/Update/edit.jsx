import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../HomePage/Home.css";
import { useFormik } from "formik";
import { ToDoListSchema } from "../schemas";

const Edit = () => {
  const [id, setId] = useState(0);
  const [initialValues, setInitialValues] = useState({ list: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("id");
    const list = localStorage.getItem("list");
    setId(id);
    setInitialValues({ list: list });
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      validationSchema: ToDoListSchema,
      onSubmit: async (values, { resetForm }) => {
        try {
          await axios.put(
            `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`,
            {
              list: values.list,
            }
          );
          navigate("/");
          resetForm();
        } catch (error) {
          console.error("Error updating data: ", error);
        }
      },
    });

  return (
    <div className="edit-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="list"
            value={values.list}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.list && touched.list && (
            <div className="form-error">{errors.list}</div>
          )}
        </div>
        <button type="submit" className="btn-edit">
          Update
        </button>
      </form>
    </div>
  );
};

export default Edit;
