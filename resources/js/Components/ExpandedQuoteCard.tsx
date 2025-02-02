import React from "react";
import { Box, Typography, Card, CardContent, Chip, keyframes, Divider } from "@mui/material";
import { IconButton } from "./IconButton";
import { Quote } from "../../types/types";
import {
    faHeart as solidHeart,
    faBookmark as solidBookmark,
} from "@fortawesome/free-solid-svg-icons";
import {
    faHeart as regularHeart,
    faBookmark as regularBookmark
} from "@fortawesome/free-regular-svg-icons";

interface ExpandedQuoteCardProps {
    quote: Quote;
    isMobile?: boolean;
}

export const ExpandedQuoteCard: React.FC<ExpandedQuoteCardProps> = ({
    quote,
    isMobile = true
}) => {
    return (
        <Box sx={{ display: "flex", flexDirection: isMobile ? "row" : "column", width: "100%", margin: "auto", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 1, alignItems: "center" }}>
                <IconButton icon={regularHeart} solidIcon={solidHeart} activeColor="red" defaultColor="black" />
                <Typography variant="caption">{quote.upvotes}</Typography>
                <IconButton icon={regularBookmark} solidIcon={solidBookmark} activeColor="blue" defaultColor="black" />
                <Typography variant="caption">{quote.saves}</Typography>
            </Box>

            {/* Content Box */}
            <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 600 }}>

                {/* Animated Divider */}
                <Divider className="animated-divider" />

                {/* Quote */}
                <Card sx={{ boxShadow: "none", marginTop: 2 }}>
                    <CardContent>
                        {quote.quote.split('\n').map((line, index) => (
                            <Typography key={index} variant="body1" paragraph>
                                {line}
                            </Typography>
                        ))}
                    </CardContent>
                </Card>

                {/* Tags */}
                <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                    {quote.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag.label}
                            size="small"
                            sx={{ fontSize: "0.75rem", cursor: "pointer" }}
                            onClick={() => alert(`Clicked on ${tag}`)}
                        />
                    ))}
                </Box>

                {/* Author Name */}
                <Typography variant="h6" sx={{ textAlign: "center", marginTop: 2 }}>
                    {quote.author.fullName}
                </Typography>
            </Box>
        </Box>
    );
};