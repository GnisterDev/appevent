"use client";

import React, { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import EventList from "@/components/calendar/calendar";

const EVENTS = [
    
    {title: "Arr1", date: "20.03.2025", rolle: "invitert"} ,
    {title: "Arr2", date: "20.03.2025", rolle: "invitert"} ,
    {title: "Arr3", date: "14.03.2025", rolle: "påmeldt"} ,
    {title: "Arr4", date: "28.03.2025", rolle: "arrangør"} ,
    {title: "Arr5", date: "17.04.2025", rolle: "påmeldt"}
  ];

export default function Home() {
  
    return (
        <main className={styles.main}>
            <div className={styles.wrapper}>
               
                <div>
                    <EventList events={EVENTS}/>
                </div>
            </div>
            
            
        </main>
    );
}
