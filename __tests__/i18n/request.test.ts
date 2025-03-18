import { cookies } from "next/headers";
import configFn from "@/i18n/request";

// Mock dependencies
jest.mock("next-intl/server", () => ({
  getRequestConfig: jest.fn(fn => fn),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Mock dynamic imports
jest.mock(
  "messages/no.json",
  () => ({
    common: {
      hello: "Hei verden",
    },
  }),
  { virtual: true }
);

jest.mock(
  "messages/en.json",
  () => ({
    common: {
      hello: "Hello world",
    },
  }),
  { virtual: true }
);

describe("Internationalization configuration", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should use 'no' locale by default when no cookie is present", async () => {
    // Mock implementation for cookies
    const mockGet = jest.fn().mockReturnValue(undefined);
    const mockCookies = Promise.resolve({
      get: mockGet,
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);

    // Call the configuration function
    const config = await configFn();

    // Verify the results
    expect(config.locale).toBe("no");
    expect(config.messages).toEqual({
      common: {
        hello: "Hei verden",
      },
    });
    expect(mockGet).toHaveBeenCalledWith("locale");
  });

  it("should use locale from cookie when available", async () => {
    // Mock implementation for cookies
    const mockGet = jest.fn().mockReturnValue({
      value: "en",
    });
    const mockCookies = Promise.resolve({
      get: mockGet,
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);

    // Call the configuration function
    const config = await configFn();

    // Verify the results
    expect(config.locale).toBe("en");
    expect(config.messages).toEqual({
      common: {
        hello: "Hello world",
      },
    });
    expect(mockGet).toHaveBeenCalledWith("locale");
  });

  it("should handle promise resolution properly from cookies", async () => {
    // Mock implementation for cookies that simulates async behavior
    const mockGet = jest.fn().mockReturnValue({
      value: "en",
    });
    const mockCookies = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          get: mockGet,
        });
      }, 10);
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);

    // Call the configuration function
    const config = await configFn();

    // Verify the results
    expect(config.locale).toBe("en");
    expect(mockGet).toHaveBeenCalledWith("locale");
  });

  it("should handle errors when loading messages", async () => {
    // Mock implementation for cookies
    const mockGet = jest.fn().mockReturnValue({
      value: "fr", // A locale that doesn't have a mock
    });
    const mockCookies = Promise.resolve({
      get: mockGet,
    });

    (cookies as jest.Mock).mockReturnValue(mockCookies);

    // Mock import to throw an error for unknown locale
    jest.mock(
      "messages/fr.json",
      () => {
        throw new Error("Module not found");
      },
      { virtual: true }
    );

    // Expect the function to throw when called
    await expect(configFn()).rejects.toThrow();
  });
});
