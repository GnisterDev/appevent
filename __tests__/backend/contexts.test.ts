import { createElement, useContext } from "react";
import { render } from "@testing-library/react";
import {
  EventContext,
  EventDisplayContext,
  UserContext,
  UserDisplayContext,
} from "../../src/firebase/contexts";

describe("Contexts", () => {
  describe("EventContext", () => {
    it("should have default values", () => {
      let contextValue;
      const TestComponent = () => {
        contextValue = useContext(EventContext);
        return null;
      };

      render(createElement(TestComponent));

      expect(contextValue).toEqual({
        formData: expect.any(Object),
        updateFormData: expect.any(Function),
      });
    });
  });

  describe("EventDisplayContext", () => {
    it("should have default values", () => {
      let contextValue;
      const TestComponent = () => {
        contextValue = useContext(EventDisplayContext);
        return null;
      };

      render(createElement(TestComponent));

      expect(contextValue).toEqual({
        eventID: null,
        eventData: null,
        isOrg: false,
        isParticipant: false,
      });
    });
  });

  describe("UserContext", () => {
    it("should have default values", () => {
      let contextValue;
      const TestComponent = () => {
        contextValue = useContext(UserContext);
        return null;
      };

      render(createElement(TestComponent));

      expect(contextValue).toEqual({
        formData: expect.any(Object),
        updateFormData: expect.any(Function),
      });
    });
  });

  describe("UserDisplayContext", () => {
    it("should have default values", () => {
      let contextValue;
      const TestComponent = () => {
        contextValue = useContext(UserDisplayContext);
        return null;
      };

      render(createElement(TestComponent));

      expect(contextValue).toEqual({
        userID: "",
        userData: expect.any(Object), // Changed from null to match your expected structure
        updateInvitedEvents: expect.any(Function),
      });
    });
  });
});
