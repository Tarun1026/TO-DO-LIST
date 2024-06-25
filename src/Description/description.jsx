import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const DescriptionEditPage = () => {
  const { id } = useParams(); 
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`
        );
        setDescription(response.data.description || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching description: ", error);
      }
    };

    fetchData();
  }, [id]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSaveDescription = async () => {
    try {
      await axios.put(
        `https://6675e56ba8d2b4d072f1d5b1.mockapi.io/data/${id}`,
        {
          description: description,
          
        }
      );
      navigate("/");
      console.log("Description updated successfully!");
    } catch (error) {
      console.error("Error updating description: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="desc">
      <h1 className="h-edit">Edit Description</h1>
      <input
        value={description}
        onChange={handleDescriptionChange}
        
        className="input-desc"
        placeholder="Enter description..."
      />
      <button onClick={handleSaveDescription} className="save-description-btn">Save</button>
    </div>
  );
};

export default DescriptionEditPage;
