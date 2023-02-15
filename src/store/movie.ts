import { Store } from '../core/core';

export interface MovieInfo {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}
interface DetailedMovie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
      Source: string
      Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

interface State {
  searchText: string
  page: number
  pageMax: number
  movies: MovieInfo[]
  movie: DetailedMovie
  loading: boolean
  message: string
}

const store = new Store<State> ({
  searchText: '',
  page: 1,
  pageMax: 1,
  movies: [],
  movie: {} as DetailedMovie,
  loading: false,
  message: 'Search for the movie title.'
})
export default store

export const searchMovies = async (page: number) => {
  store.state.loading = true
  store.state.page = page
  if (page === 1) {
    store.state.movies = []
    store.state.message = ''
  }

  try {
    const res = await fetch('/api/movie', {
      method: 'POST',
      body: JSON.stringify({
        title: store.state.searchText,
        page
      })
    })
    // const json = await res.json();
    const { Search, totalResults, Response, Error } = await res.json();
    if (Response === "True") {
      store.state.movies = [
        ...store.state.movies,
        ...Search
      ]
      store.state.pageMax = Math.ceil(Number(totalResults) / 10)
    } else {
      store.state.message = Error
    }
  } catch (error) {
    console.log(error)
  } finally {
    store.state.loading = false
  }
  // console.log(store);
}

export const getMovieDetails = async (id: string) => {
  try {
    const res = await fetch('/api/movie', {
      method: 'POST',
      body: JSON.stringify({
        id
      })
    })
    store.state.movie = await res.json()
  } catch (error) {
    console.log(error)
  }
}