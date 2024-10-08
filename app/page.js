"use client";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ textAlign: "center", my: 4 }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 2 }}
            href="/generate"
          >
            Get Started
          </Button>
          <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
            Learn More
          </Button>
        </Box>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign={"center"}
          color="Warning"
          gutterBottom
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography varient="h1">Easy Text Input</Typography>
            <Typography>
              Simply enter your text and let our software do the rest. Creating
              flashcard has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography varient="h6">Smart Flashcards.</Typography>
            <Typography>
              Our AI intelligently breaks down your text into concise
              flashcards,perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography varient="h6">Accessible anywhere.</Typography>
            <Typography>
              Access your flashcard any device,at any time.Study on the go with
              ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
                minHeight: "200px",
              }}
            >
              <Typography varient="h5" gutterBottom>
                Basics
              </Typography>
              <Typography gutterBottom>5$ / month</Typography>
              <Typography>
                Access to basic flashcard features and limited storage.
              </Typography>
              <button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose basics
              </button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
                minHeight: "200px",
              }}
            >
              <Typography varient="h5" gutterBottom>
                Pro
              </Typography>
              <Typography gutterBottom>10$ / month</Typography>
              <Typography>
                Access to pro flashcard features and limited storage. Unlimited
                flashcard and storage, with priority support.
              </Typography>
              <button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                // onClick={handleSubmit}
              >
                Choose Pro
              </button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
