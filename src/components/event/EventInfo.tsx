import React from "react";
import styles from "./eventinfo.module.css";
import { Calendar, MapPin, Users } from "lucide-react";
import EventTags from "./Tags";

const tags = ["Rumpeldunk", "Fotball", "Indøk"]; //Dummy

const EventInfo = () => {
  return (
    <div>
      <div>
        <h1 className={styles.title}>TITLE</h1>
        <div className={styles.quickinfo}>
          <div className={styles.quickinfoElement}>
            <Calendar
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>DATE, TIME</span>
          </div>
          <div className={styles.quickinfoElement}>
            <MapPin
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>PLACE, CITY</span>
          </div>
          <div className={styles.quickinfoElement}>
            <Users
              size={"1.25rem"}
              color={"var(--text-secondary)"}
              strokeWidth={2.25}
            />
            <span>NUMBER påmeldte</span>
          </div>
        </div>
      </div>
      <div>
        <EventTags tags={tags} />
      </div>
      <div className={styles.textArea}>
        <h2 className={styles.title}>Om arrangemanget</h2>
        <p className={styles.text}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere
          veniam, odit qui sit iste necessitatibus quidem tempore eos dolorem
          ducimus. Sequi maxime sint illo corrupti atque dolor accusantium. Nam
          distinctio itaque molestiae officia dignissimos a blanditiis
          voluptatum dolores voluptates. Voluptatum adipisci, possimus
          consectetur enim atque pariatur ullam! Velit deleniti aliquid tempora
          nisi quo sint totam vitae repudiandae animi, alias voluptatum
          consectetur fugit facilis iusto aliquam tempore aspernatur culpa
          praesentium qui est hic nihil, repellat enim possimus. Itaque mollitia
          quisquam ipsa quibusdam accusamus tempora inventore, sapiente aliquid
          repellendus explicabo illo corrupti commodi quidem aut laborum sit qui
          odio nostrum animi doloremque.
        </p>
      </div>
    </div>
  );
};

export default EventInfo;
