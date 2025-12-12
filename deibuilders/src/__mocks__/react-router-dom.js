const React = require('react');

// Minimal mock of react-router-dom for tests.
// Provide BrowserRouter/MemoryRouter, Routes, Route, Link and useNavigate.

function BrowserRouter({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function MemoryRouter({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function Routes({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function Route(props) {
  // Render element prop if provided (like <Route element={<Comp/>} />)
  return props.element || null;
}

function Link({ children }) {
  return React.createElement('span', null, children);
}

function NavLink({ children }) {
  return React.createElement('span', null, children);
}

function useNavigate() {
  return () => {};
}

module.exports = {
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
};
