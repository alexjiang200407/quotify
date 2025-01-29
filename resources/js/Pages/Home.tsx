import React from "react";
import { Box, Typography, Card, CardContent, Chip, Divider } from "@mui/material";
import { faHeart as solidHeart, faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart, faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { IconButton } from "../Components/IconButton";

const Home = () => {
    const quote = `All the world's a stage,\nAnd all the men and women merely players;\nThey have their exits and their entrances;\nAnd one man in his time plays many parts,\nHis acts being seven ages.`;
    const author = "William Shakespeare";
    const likeCount = 120;
    const saveCount = 45;
    const isMobile = true;
    const tags = ["Philosophy", "Poetry", "Renaissance"];

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
            {/* Container Box */}
            <Box sx={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", gap: 2 }}>
                {/* Icons Box */}
                <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 1, alignItems: "center" }}>
                    <IconButton icon={regularHeart} solidIcon={solidHeart} activeColor="red" defaultColor="black" />
                    <Typography variant="caption">{likeCount}</Typography>
                    <IconButton icon={regularBookmark} solidIcon={solidBookmark} activeColor="blue" defaultColor="black" />
                    <Typography variant="caption">{saveCount}</Typography>
                </Box>

                {/* Content Box */}
                <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 600 }}>
                    {/* Title */}
                    <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
                        Quote of the Day
                    </Typography>

                    {/* Animated Divider */}
                    <Divider className="animated-divider" />

                    {/* Quote */}
                    <Card sx={{ boxShadow: "none", marginTop: 2 }}>
                        <CardContent>
                            {quote.split('\n').map((line, index) => (
                                <Typography key={index} variant="body1" paragraph>
                                    {line}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                        {tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{ fontSize: "0.75rem", cursor: "pointer" }}
                                onClick={() => alert(`Clicked on ${tag}`)} // Replace this with actual navigation or filtering logic
                            />
                        ))}
                    </Box>

                    {/* Author Name */}
                    <Typography variant="h6" sx={{ textAlign: "center", marginTop: 2 }}>
                        {author}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
