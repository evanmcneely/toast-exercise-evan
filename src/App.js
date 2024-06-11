import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";

import Header from "./Header";
import Content from "./Content";
import Toasts from "./Toasts";
import { fetchLikedFormSubmissions } from "./service/mockServer";

function App() {
  /**  project level state */
  const [likedSubmissions, setLikedSubmissions] = useState({
    loading: true,
    error: null,
    data: [],
  });

  useEffect(() => {
    // fetch the list of liked submissions using fetchLikedFormSubmissions
    fetchLikedFormSubmissions().then((res) => {
      if (res.status !== 200) {
        throw new Error("unknown error getting liked form submissions");
      }
      setLikedSubmissions({
        ...likedSubmissions,
        loading: false,
        data: res.formSubmissions,
      });
    });
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Content likedSubmissions={likedSubmissions} />
      </Container>
      <Toasts setLikedSubmissions={setLikedSubmissions} />
    </>
  );
}

export default App;
