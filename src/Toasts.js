import React, { useState, useEffect, useMemo } from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

import { onMessage, saveLikedFormSubmission } from "./service/mockServer";

export default function Toasts({ setLikedSubmissions }) {
  /** State for managing toasts */
  const [toast, setToast] = useState({
    backlog: [],
    current: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    // subscribe the handleNewSubmission function to the to event of a new submission being created
    onMessage(handleNewSubmission);
  });

  /** user event handlers */
  function handleNewSubmission(submission) {
    /** add the new submission to either
     *      1. toast backlog if the current toast is in a loading or error state
     *      2. current toast if there is no backlog    */
    setToast((state) => {
      if (state.loading || state.error) {
        return { ...state, backlog: [...state.backlog, submission] };
      } else if (state.current) {
        return {
          ...state,
          backlog: [...state.backlog, state.current],
          current: submission,
        };
      } else {
        return { ...state, current: submission };
      }
    }, []);
  }

  // throttle the like button functionality to only run if the loading/saving state is false
  function throttleHandleLike() {
    let saving = false;
    return (submission) => {
      if (!saving) {
        saving = true;
        setToast((state) => {
          return { ...state, loading: true };
        });

        saveLikedFormSubmission(submission)
          .then((res) => {
            if (res.status !== 202) {
              throw new Error("unknown error saving liked form submission");
            }
            setLikedSubmissions((state) => {
              submission.liked = true;
              return {
                ...state,
                data: [...state.data, submission],
              };
            });
            handleClose();
          })
          .catch((error) => {
            // retry save?
            setToast((state) => {
              return { ...state, error: error.message, loading: false };
            });
            saving = false;
          });
      }
    };
  }

  const handleLike = useMemo(() => throttleHandleLike(), []);

  function handleClose() {
    // set the current toast to the next one in the backlog and remove that toast from backlog
    setToast((state) => {
      const current = state.backlog[state.backlog.length - 1] || null;
      const backlog = [...state.backlog];
      backlog.splice(-1, 1);
      return {
        backlog: backlog,
        current: current,
        error: null,
        loading: false,
      };
    });
  }

  return (
    <>
      {toast.current && (
        <Snackbar
          key={toast.current.id}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={true}
          message={
            <Message
              name={`${toast.current.data.firstName} ${toast.current.data.lastName}`}
              email={toast.current.data.email}
            />
          }
          action={
            <Action
              handleLike={handleLike}
              handleClose={handleClose}
              submission={toast.current}
              loading={toast.loading}
              error={toast.error}
            />
          }
        />
      )}
    </>
  );
}

function Message({ name, email }) {
  return (
    <>
      <Typography variant="button" component="div">
        {name}
      </Typography>
      <Typography variant="button" component="div">
        {email}
      </Typography>
    </>
  );
}

function Action({ handleLike, handleClose, submission, loading, error }) {
  return (
    <>
      <Button color="secondary" onClick={() => handleLike(submission)}>
        {loading ? "Saving" : "LIKE"}
      </Button>
      {error && (
        <Typography variant="button" component="div" sx={{ color: "red" }}>
          Try Again
        </Typography>
      )}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
}
