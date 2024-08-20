<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Zah is a housing Co-Operative based in Didsbury Manchester. It is one of the longest running Co-Ops in the UK and promotes social housing. This website offers a way for the members to connect internally and to the wider social housing community">

        <title inertia>{{ config('app.name', 'Zah') }}</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap">
    
        <!-- favicon -->
        <link rel="icon" sizes="16x16" href="{{ asset('/favicon-16x16.png') }}" type="image/png">
        <link rel="icon" sizes="32x32" href="{{ asset('/favicon-32x32.png') }}" type="image/png">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/apple-touch-icon.png') }}">
        <link rel="manifest" href="{{ asset('site.webmanifest') }}">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead

        <!-- import Raleway Font -->
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');
        </style>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
