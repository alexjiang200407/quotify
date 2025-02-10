import { useState, useEffect } from 'react';
import React from 'react';

interface WikipediaResponse {
  query: {
    pages: {
      [key: string]: {
        title?: string;
        thumbnail?: {
          source: string;
          width: number;
          height: number;
        };
        pageimage?: string;
      };
    };
  };
}

interface WikiPortraitProps {
  personName: string;
  width?: number;
  height?: number;
}

const WikiPortrait = ({ personName, width = 200, height = 200 }: WikiPortraitProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${encodeURIComponent(
            personName
          )}&pithumbsize=500&piprop=thumbnail`
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data: WikipediaResponse = await response.json();
        const page = Object.values(data.query.pages)[0];

        if (!page.thumbnail) {
          throw new Error('No portrait found for this person');
        }

        // Resize the image URL while maintaining aspect ratio
        const resizedUrl = page.thumbnail.source
          .replace(/\/\d+px-/, `/${width}px-`);

        setImageUrl(resizedUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch image');
      }
    };

    fetchImage();
  }, [personName, width, height]);

  return (
    <div style={{ 
      width: `${width}px`, 
      height: `${height}px`,
      overflow: 'hidden',
      borderRadius: '50%',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <img
        src={!imageUrl || error ? undefined : imageUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top'
        }}
      />
    </div>
  );
};

export default WikiPortrait;