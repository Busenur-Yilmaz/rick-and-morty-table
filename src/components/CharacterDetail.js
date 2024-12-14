import React from 'react';

const CharacterDetail = ({ character }) => {
  if (!character) return <div>Select a character to see details.</div>;

  return (
    <div>
      <h2>{character.name}</h2>
      <p><strong>Species:</strong> {character.species}</p>
      <p><strong>Gender:</strong> {character.gender}</p>
      <p><strong>Status:</strong> {character.status}</p>
      <img src={character.image} alt={character.name} />
    </div>
  );
};

export default CharacterDetail;
