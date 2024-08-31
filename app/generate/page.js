"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FlipCard from "./card";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";

const demoCards = [
  {
    front:
      "Transformers is a franchise encompassing films, TV series, comics, and toys.",
    back: "It centers around the conflict between Autobots and Decepticons, extraterrestrial robot factions.",
  },
  {
    front: "The Autobots are heroic robots led by Optimus Prime.",
    back: "The Decepticons are villainous robots led by Megatron.",
  },
  {
    front: "The AllSpark is a powerful artifact in the Transformers universe.",
    back: "It grants life and immense energy, often becoming the object of conflict.",
  },
  {
    front:
      "Transformers narratives often intertwine the lives of humans and Autobots.",
    back: "They explore themes of friendship, sacrifice, and the battle between good and evil.",
  },
  {
    front: "Optimus Prime is the leader of the Autobots.",
    back: "He is a noble and courageous robot who fights for justice.",
  },
  {
    front: "Megatron is the leader of the Decepticons.",
    back: "He is a ruthless and ambitious robot who seeks power.",
  },
  {
    front:
      "The Autobots and Decepticons are constantly battling for control of the AllSpark.",
    back: "This artifact's immense power fuels their conflict.",
  },
  {
    front:
      "Transformers stories often showcase the importance of friendship and sacrifice.",
    back: "These themes are reflected in the relationships between humans and robots.",
  },
  {
    front: "The Transformers franchise has a vast and complex mythology.",
    back: "It includes characters, locations, and events spanning multiple media formats.",
  },
  {
    front:
      "Transformers is a popular franchise that has captured the imaginations of audiences worldwide.",
    back: "It continues to be a source of entertainment and inspiration.",
  },
];

export default function Generate() {
  // console.log(process.env.FIREBASE_API_KEY);
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [text, setText] = useState("");
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    fetch("/api/generate", {
      method: "POST",
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }
    if (!user) {
      alert("Please login to save your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      router.push("/flashcards");
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }

  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          textAlign={"center"}
          gutterBottom
        >
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{
            mb: 2,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FlipCard front={flashcard.front} back={flashcard.back} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* {demoCards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {demoCards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FlipCard front={flashcard.front} back={flashcard.back} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )} */}
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Save Flashcards
          </Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collect Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            varient="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
