import React from "react";
import { Box, Typography, Card, CardContent, Chip, Divider } from "@mui/material";
import { faHeart as solidHeart, faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart, faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { IconButton } from "../Components/IconButton";
import { ExpandedQuoteCard } from "../Components/ExpandedQuoteCard";

const Home = () => {
    const quote = {
        id: 1,
        quote: "All the world's a stage,\nAnd all the men and women merely players;\nThey have their exits and their entrances;\nAnd one man in his time plays many parts,\nHis acts being seven ages.",
        author: {
            id: 1,
            fullName: "William Shakespeare",
            wikiPage: "https://en.wikipedia.org/wiki/William_Shakespeare",
            description: "English playwright, poet, and actor, widely regarded as the greatest writer in the English language."
        },
        tags: [
            { id: 1, label: "Philosophy" },
            { id: 2, label: "Poetry" },
            { id: 3, label: "Renaissance" }
        ],
        upvotes: 120,
        saves: 45
    }
    const isMobile = true;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center", zIndex: 2 }}>
                Quote of the Day
            </Typography>

            <Box sx={{ position: "relative", zIndex: 1 }}>
                <ExpandedQuoteCard quote={quote} />
            </Box>
        </Box>
    );
};

export default Home;
