import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { IconButton } from "./IconButton";
import {
    faHeart as solidHeart,
    faBookmark as solidBookmark,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    faHeart as regularHeart,
    faBookmark as regularBookmark
  } from "@fortawesome/free-regular-svg-icons";
import {Quote} from "../../types/types"

interface CompactCardProps {
  quote: Quote;
  index: number;
  onClick: (index: number) => void;
  
}

export const CompactCard: React.FC<CompactCardProps> = ({ quote, index, onClick }) => {
  return (
    <Card
      onClick={() => onClick(index)}
      sx={{
        width: "100%",
        padding: 3,
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.01)" }
      }}
    >
      <CardContent sx={{ flexGrow: 1, overflow: "hidden", padding: 0, "&:last-child": { pb: 0 } }}>
        <Typography
          variant="body1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "1.5",
            marginBottom: 2,
            display: "block",
          }}
        >
          {quote.quote}
        </Typography>

        <Typography variant="caption" sx={{ fontStyle: "italic", display: "block", marginBottom: 1.5 }}>
          {quote.author.fullName}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 2 }}>
          {quote.tags.map((tag, tagIndex) => (
            <Chip
              key={tagIndex}
              label={tag.label}
              size="small"
              sx={{ fontSize: "0.75rem", cursor: "pointer", pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 4, pointerEvents: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              icon={regularHeart}
              solidIcon={solidHeart}
              activeColor="red"
              defaultColor="black"
            />
            <Typography variant="caption">{quote.upvotes}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              icon={regularBookmark}
              solidIcon={solidBookmark}
              activeColor="blue"
              defaultColor="black"
            />
            <Typography variant="caption">{quote.saves}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};