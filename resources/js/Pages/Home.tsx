import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { faHeart as solidHeart, faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart, faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { IconButton } from "../Components/IconButton";

const Home = () => {
    const quote = `All the world's a stage,\nAnd all the men and women merely players;\nThey have their exits and their entrances;\nAnd one man in his time plays many parts,\nHis acts being seven ages.`;
    const author = "William Shakespeare";
    const likeCount = 120;
    const saveCount = 45;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                padding: 2,
            }}
        >
            {/* Title */}
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center", marginBottom: 2 }}>
                Quote of the Day
            </Typography>

            {/* Quote Card */}
            <Card sx={{ display: "flex", maxWidth: 600, boxShadow: "none" }}>
                {/* Icons */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                        padding: 2,
                        marginRight: 2,
                        alignItems: "center",
                    }}
                >
                    <IconButton icon={regularHeart} solidIcon={solidHeart} activeColor="red" defaultColor="black" />
                    <Typography variant="caption">{likeCount}</Typography>
                    <IconButton icon={regularBookmark} solidIcon={solidBookmark} activeColor="blue" defaultColor="black" />
                    <Typography variant="caption">{saveCount}</Typography>
                </Box>

                {/* Quote Content */}
                <CardContent sx={{ textAlign: "left", flex: 1 }}>
                    {quote.split('\n').map((line, index) => (
                        <Typography key={index} variant="body1" paragraph>
                            {line}
                        </Typography>
                    ))}
                </CardContent>
            </Card>

            {/* Author Name */}
            <Typography variant="h6" sx={{ textAlign: "center"}}>
                {author}
            </Typography>
        </Box>
    );
};

export default Home;
