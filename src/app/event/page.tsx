"use client";

import React, { useState } from "react";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

const CreateEventForm: React.FC = () => {
    const [formData, setFormData] = useState ({
        eventName: "",
        startDateTime: "",
        startTimeTime: "",
        endDateTime: "",
        endTimeTime: "",
        place: "",
        type: "",
        description: "",
        tags: [] as string[]  // Endre fra string til string[], så vi kan lagre et array av strenger
    });

    const [error, setError] = useState<string | null> (null);
    const router = useRouter(); // For å komme mellom sider 
        const [currentTag, setCurrentTag] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Oppdaterer data ettersom bruker skriver inn i feltet, name tilsvarer ulik infoType 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors
    }

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault(); // Hindrer skjemaet fra å sende seg selv, currentTag.trim tilsvarer skriften i tagen

            if (!formData.tags.includes(currentTag.trim())) {
                setFormData({...formData, tags: [...formData.tags, currentTag.trim()]}); // Legger til en ny tag i formData sin tag-oversikt, og beholder dne gamle oversikten 
            }
        }
    }

  return (
    <div>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form className="create-event-form" onSubmit={handleSubmit}>
                    <h2> Create Event</h2>

                    <div className="form-group">
                        <label htmlFor="eventName">Event name: </label>
                        <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        placeholder="Event name"
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDateTime">Start time: </label>
                        
                        <input
                        type="date"
                        id="startDateTime"
                        name="startDateTime"
                        value={formData.startDateTime}
                        onChange={handleChange}
                        required
                        />

                        <input
                        type="time"
                        id="startTimeTime"
                        name="startTimeTime"
                        value={formData.startTimeTime}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDateTime">End time: </label>
                        <input
                        type="date"
                        id="endDateTime"
                        name="endDateTime"
                        value={formData.endDateTime}
                        onChange={handleChange}
                        required
                        />

                        <input
                        type="time"
                        id="endTimeTime"
                        name="endTimeTime"
                        value={formData.endTimeTime}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="place">Place: </label>
                        <input
                        type="text"
                        id="place"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        placeholder="Adress"
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type: </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select type</option>
                            <option value="party">Party</option>
                            <option value="familyGathering">Family Gathering</option>
                            <option value="festival">Festival</option>
                            <option value="charity">Charity</option>
                            <option value="sportEvent">Sports Event</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description: </label>
                        <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        />
                    </div>

                    <div className="form-group">
                        <h3>TAGS: </h3>
                        <p>{formData.tags}</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Legg til tags: </label>
                        <input
                        id="tags"
                        name="tags"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        />
                    </div>


                    <button type="submit" className="create-event-button">
                    Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default CreateEventForm;
