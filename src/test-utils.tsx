import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "messages/no.json"; // Adjust this path based on your locale file structure

const customRender = (
  ui: React.ReactElement,
  { locale = "en", messages: customMessages = messages, ...options } = {}
) => {
  return rtlRender(
    <NextIntlClientProvider locale={locale} messages={customMessages}>
      {ui}
    </NextIntlClientProvider>,
    options
  );
};

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override the render method
export { customRender as render };
