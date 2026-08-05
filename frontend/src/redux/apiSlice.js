import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {getAccessToken} from '../authStore';

const isLocalHost = () =>
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const getBaseUrl = () => {
    if (isLocalHost()) return process.env.REACT_APP_API_URL || 'http://localhost:8081';
    return process.env.REACT_APP_API_URL || 'https://nmoviesapi.duckdns.org';
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/v1`,
        prepareHeaders: (headers) => {
            const token = getAccessToken();
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Movie', 'User', 'Admin', 'Show'],
    endpoints: (builder) => ({
        // Movie endpoints
        getMovies: builder.query({query: () => '/movies', providesTags: ['Movie']}),
        getMovieById: builder.query({query: (id) => `/movies/${id}`, providesTags: ['Movie']}),
        createMovie: builder.mutation({
            query: (data) => ({url: '/movies', method: 'POST', body: data}),
            invalidatesTags: ['Movie']
        }),
        updateMovie: builder.mutation({
            query: ({id, ...data}) => ({url: `/movies/${id}`, method: 'PUT', body: data}),
            invalidatesTags: ['Movie']
        }),
        deleteMovie: builder.mutation({
            query: (id) => ({url: `/movies/${id}`, method: 'DELETE'}),
            invalidatesTags: ['Movie']
        }),

        // User endpoints
        getUsers: builder.query({query: () => '/customers', providesTags: ['User']}),
        getUserById: builder.query({query: (id) => `/customers/${id}`, providesTags: ['User']}),
        updateUser: builder.mutation({
            query: ({id, ...data}) => ({url: `/customers/${id}`, method: 'PUT', body: data}),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: (id) => ({url: `/customers/${id}`, method: 'DELETE'}),
            invalidatesTags: ['User']
        }),

        // Movie pagination endpoints
        getMoviesPaginated: builder.query({
            query: ({page = 0, size = 15}) => `/movies/paginated?page=${page}&size=${size}`,
            providesTags: ['Movie'],
        }),
        searchMoviesPaginated: builder.query({
            query: ({query, page = 0, size = 15}) => `/movies/search?query=${query}&page=${page}&size=${size}`,
            providesTags: ['Movie'],
        }),

        // Show endpoints
        getShows: builder.query({query: () => '/shows', providesTags: ['Show']}),
        getShowById: builder.query({query: (id) => `/shows/${id}`, providesTags: ['Show']}),
        createShow: builder.mutation({
            query: (data) => ({url: '/shows', method: 'POST', body: data}),
            invalidatesTags: ['Show']
        }),
        updateShow: builder.mutation({
            query: ({id, ...data}) => ({url: `/shows/${id}`, method: 'PUT', body: data}),
            invalidatesTags: ['Show']
        }),
        deleteShow: builder.mutation({
            query: (id) => ({url: `/shows/${id}`, method: 'DELETE'}),
            invalidatesTags: ['Show']
        }),
    }),
});

export const {
    useGetMoviesQuery,
    useGetMovieByIdQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
    useDeleteMovieMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetMoviesPaginatedQuery,
    useLazySearchMoviesPaginatedQuery,
    useGetShowsQuery,
    useGetShowByIdQuery,
    useCreateShowMutation,
    useUpdateShowMutation,
    useDeleteShowMutation,
} = apiSlice;