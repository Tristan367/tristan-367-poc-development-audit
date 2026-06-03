# poc-development-audit

Movie API audit project with route-based handlers and Jest tests.

## Base URL

`http://localhost:3750`

## Health

- `GET /` -> `200` with `{ "message": "Hello World!" }`

## API Methods

### Read (GET)

#### `GET /api/movies/all`
Get all movies.
Body: none

#### `GET /api/movies/id/{id}`
Get one movie by id.
Body: none

#### `GET /api/movies/between/{startReleaseYear}/and/{endReleaseYear}`
Get movies by release year range.
Body: none

#### `GET /api/movies/character/{characterName}/name`
Get movie summaries by character name.
Body: none

#### `GET /api/movies/by-race/{race}`
Get movies with characters filtered by race.
Body: none

#### `GET /api/movies/movie-id/{movieId}/character-name/{characterName}`
Get one character record from one movie.
Body: none

#### `GET /api/movies/movie-id/{movieId}/characters`
Get all character names for one movie.
Body: none

#### `GET /api/movies/all/characters`
Get unique characters across all movies.
Body: none

#### `GET /api/movies/by/race/{raceName}`
Get unique character names by race with movie list.
Body: none

### Create (POST)

#### `POST /api/movie/add`
Add one movie.
```json
{
  "movieName": "The Two Towers Extended",
  "releaseYear": 2024
}
```

#### `POST /api/movie/character/add`
Add one character to one movie (body-based).
```json
{
  "movieId": "69efd1c1b2f8c7327f029fad",
  "characterName": "Helm"
}
```

#### `POST /api/movie/{movie_id}/character/{mainCharacterName}/add`
Add one character to one movie (params-based).
Body: none

#### `POST /api/movie/add/characters`
Add one character to multiple movies.
```json
{
  "movies": ["69efd1c1b2f8c7327f029fae", "69efd1c1b2f8c7327f029fb1"],
  "characterToAdd": {
    "id": "6a15b1d58291c3d1a98c2ac1",
    "name": "Dave Jones",
    "race": "Man"
  }
}
```

#### `POST /api/movies/add/all`
Bulk add movies. Response includes `ADDED`/`NOT ADDED` per item.
```json
[
  {
    "_id": "69efd1c1b2f8c7327f029fad",
    "title": "The Lord of the Rings: The Fellowship of the Ring",
    "releaseYear": 2001,
    "characters": [
      { "name": "Frodo Baggins", "race": "Hobbit" }
    ]
  }
]
```

### Update (PUT)

#### `PUT /api/movie/name/update`
Update a movie title.
```json
{
  "movieId": "69efd1c1b2f8c7327f029fad",
  "movieName": "The Fellowship Extended"
}
```

#### `PUT /api/movie/{movieId}/character/{characterId}/name/{characterName}/update`
Update a character name (params-based).
Body: none

#### `PUT /api/movie/character/update`
Update a character name (body-based).
```json
{
  "movieId": "69efd1c1b2f8c7327f029fad",
  "characterId": "6a15b1d58291c3d1a98c2ac1",
  "name": "Smeagol"
}
```

#### `PUT /api/movie/characters/update`
Bulk add/update characters for one movie with per-item status.
```json
{
  "_id": "69efd1c1b2f8c7327f029fad",
  "characters": [
    { "_id": "6a1e03d0a7e982d8b6bc2a82", "name": "Frodo Baggins", "race": "Hobbit" }
  ]
}
```

### Delete (DELETE)

#### `DELETE /api/movies/character/delete`
Delete one character from one movie.
```json
{
  "movieId": "69efd1c1b2f8c7327f029fad",
  "characterId": "6a1e03d0a7e982d8b6bc2a82"
}
```

#### `DELETE /api/movie/{movieId}/characters/delete`
Delete all characters from one movie.
Body: none

#### `DELETE /api/movies/delete`
Delete all movies.
Body: none

## Notes

- Tests are in colocated `index.test.js` files for each route handler folder.
- Route discovery is recursive and driven by `route.yaml` files.