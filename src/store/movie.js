import { Store } from '../core/core';

const store = new Store ({
  searchText: '',
  page: 1,
  pageMax: 1,
  movies: [],
  movie: {},
  loading: false,
  message: 'Search for the movie title.'
})
export default store

export const searchMovies = async page => {
  store.state.loading = true
  store.state.page = page
  if (page === 1) {
    store.state.movies = []
    store.state.message = ''
  }

  try {
    const res = await fetch(`https://omdbapi.com/?&apikey=3b7469b3&s=${store.state.searchText}&page=${page}`);
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

  } finally {
    store.state.loading = false
  }
  // console.log(store);
}

export const getMovieDetails = async id => {
  try {
    const res = await fetch(`https://omdbapi.com/?&apikey=3b7469b3&i=${id}&plot=full`)
    store.state.movie = await res.json()
  } catch (error) {
    console.log(error)
  }
}