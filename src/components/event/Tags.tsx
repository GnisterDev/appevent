import React from "react";

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div>
      {tags.map((tag, key) => {
        return <div key={key}>{tag}</div>;
      })}
    </div>
  );
};

export default EventTags;
