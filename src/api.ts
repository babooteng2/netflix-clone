const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
}
export interface IGetMoviesResult {
  dates: {
    minimun: string;
    maximun: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_KEY}`
  ).then((response) => response.json());
}

/*
https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&query=dune&page=1&include_adult=false
*/
