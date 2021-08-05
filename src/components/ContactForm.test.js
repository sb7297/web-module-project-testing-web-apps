import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
  render(<ContactForm />);
});

test('renders the contact form header', ()=> {
  render(<ContactForm />);

  // this would accomplish all assertions below
  // const header = screen.getByText("Contact Form");
  const header = screen.queryByText(/contact form/i);

  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent("Contact Form");
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />);
  
  const firstName = screen.getByLabelText('First Name*');
  userEvent.type(firstName, "Amy");
  expect(firstName).toHaveValue("Amy");

  const errors = screen.getAllByTestId("error");
  expect(errors).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />);
  
  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);

  const errors = screen.getAllByTestId("error");
  expect(errors).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />);
  
  const submitBtn = screen.getByRole("button");
  const firstName = screen.getByLabelText('First Name*');
  const lastName = screen.getByLabelText('Last Name*');
  
  userEvent.type(firstName, "Taylor");
  userEvent.type(lastName, "Hebert");
  userEvent.click(submitBtn);

  const errors = screen.getAllByTestId("error");
  expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  
  const email = screen.getByLabelText('Email*');
  userEvent.type(email, "ajgp");

  screen.getByText(/email must be a valid email address/);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);
  
  screen.getByText(/lastName is a required field/);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);

  const submitBtn = screen.getByRole("button");
  const firstName = screen.getByLabelText('First Name*');
  const lastName = screen.getByLabelText('Last Name*');
  const email = screen.getByLabelText('Email*');
  
  userEvent.type(firstName, "Taylor");
  userEvent.type(lastName, "Hebert");
  userEvent.type(email, "weaver@chicago.prt.gov");
  
  expect(screen.queryByText(/Taylor/)).toBeNull();
  expect(screen.queryByText(/Hebert/)).toBeNull();
  expect(screen.queryByText(/weaver@chicago.prt.gov/)).toBeNull();
  
  userEvent.click(submitBtn);
  
  screen.getByText(/Taylor/);
  screen.getByText(/Hebert/);
  screen.getByText(/weaver@chicago.prt.gov/);

  expect(screen.queryByText(/Message: /)).toBeNull();
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm />);

  const submitBtn = screen.getByRole("button");
  const firstName = screen.getByLabelText('First Name*');
  const lastName = screen.getByLabelText('Last Name*');
  const email = screen.getByLabelText('Email*');
  const message = screen.getByLabelText('Message');
  
  userEvent.type(firstName, "Taylor");
  userEvent.type(lastName, "Hebert");
  userEvent.type(email, "weaver@chicago.prt.gov");
  userEvent.type(message, "Cut ties. I'm sorry.");
  userEvent.click(submitBtn);
  
  screen.getByText(/Taylor/);
  screen.getByText(/Hebert/);
  screen.getByText(/weaver@chicago.prt.gov/);
  const msgDisplay = screen.getByTestId("messageDisplay");

  expect(msgDisplay).toHaveTextContent("Cut ties.");
});