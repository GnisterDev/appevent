import EventTags from "@/components/event/Tags";
import React from "react";

const EventView = () => {
  return (
    <div>
      <EventTags tags={["tag1", "tag2", "tag3"]} />
    </div>
  );
};

export default EventView;
