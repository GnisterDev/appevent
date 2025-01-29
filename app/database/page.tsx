"use client"

import React, { useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { db } from "../firebase/config";

const AddToFirebase: React.FC = () => {
  const [newData, setNewData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'yourCollectionName'), newData);
      console.log('Document written with ID: ', docRef.id);
      setNewData({ name: '', description: '', /* ... */ });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      <h2>Add Data to Firebase</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={newData.description}
            onChange={handleChange}
          />
        </div>
        {/* Add more input fields for other fields */}
        <button type="submit">Add to Firebase</button>
      </form>
    </div>
  );
};

export default AddToFirebase;