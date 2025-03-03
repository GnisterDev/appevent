const CommentItem = ({ text, userID }: { text: string; userID: string }) => {
  return (
    <div>
      <strong>{userID}:</strong> {text}
    </div>
  );
};

export default CommentItem;
