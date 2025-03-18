import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentSection from "@/components/event/overview/comments/CommentSection";
import {
  addComment,
  getComments,
  deleteComment,
} from "@/firebase/DatabaseService";
import { EventDisplayContext } from "@/firebase/contexts";
import { Comment } from "@/firebase/Comment";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { DefaultEventData } from "@/firebase/Event";

jest.mock("@/firebase/DatabaseService", () => ({
  getComments: jest.fn(),
  addComment: jest.fn(),
  deleteComment: jest.fn(),
  getUser: jest.fn().mockResolvedValue({ id: "userID1", name: "Test User" }),
}));

jest.mock("next-intl", () => ({
  useTranslations: jest.fn().mockReturnValue((key: string) => key),
}));

describe("CommentSection", () => {
  const eventID = "eventID1";
  const mockComments: Comment[] = [
    {
      commentID: "commentID1",
      author: { id: "userID1" } as unknown as DocumentReference,
      content: "This is a test comment",
      time: Timestamp.fromDate(new Date(1672531200)),
    },
    {
      commentID: "commentID2",
      author: { id: "userID2" } as unknown as DocumentReference,
      content: "Another test comment",
      time: Timestamp.fromDate(new Date(1672531200)),
    },
  ];

  const renderWithContext = () => {
    return render(
      <EventDisplayContext.Provider
        value={{
          eventID,
          eventData: DefaultEventData,
          isOrg: false,
          participants: [],
          refreshInfo: () => Promise.resolve(),
        }}
      >
        <CommentSection />
      </EventDisplayContext.Provider>
    );
  };

  beforeEach(() => {
    (getComments as jest.Mock).mockResolvedValue(mockComments);
    (addComment as jest.Mock).mockResolvedValue(mockComments[0]);
    (deleteComment as jest.Mock).mockResolvedValue(null);
  });

  it("renders comments and handles adding a new comment", async () => {
    renderWithContext();

    // Ensure comments are rendered before checking for trash-icon
    await waitFor(() => {
      expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    });

    await waitFor(() => {
      // Ensure comments are rendered
      expect(screen.getByText("This is a test comment")).toBeInTheDocument();
      expect(screen.getByText("Another test comment")).toBeInTheDocument();
    });

    // Test adding a new comment
    const newCommentContent = "New test comment";
    const input = screen.getByPlaceholderText("...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: newCommentContent } });
    fireEvent.submit(input);
  });

  it("renders loading state initially", () => {
    (getComments as jest.Mock).mockResolvedValueOnce([]);
    renderWithContext();

    // nothing to be in the component
    expect(
      screen.queryByText("This is a test comment")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Another test comment")).not.toBeInTheDocument();
  });

  it("displays error if fetching comments fails", async () => {
    (getComments as jest.Mock).mockRejectedValueOnce(
      "Failed to fetch comments"
    );

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch comments")).toBeInTheDocument();
    });
  });
});
