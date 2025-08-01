import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";

import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate
      loading={<h1>Loading Persistor . . . </h1>}
      persistor={persistor}
    >
      <App/>
    </PersistGate>
  </Provider>
);
