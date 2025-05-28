const redirects = async () => {
  return [
    {
      // Przekierowanie z głównej strony na admin panel
      source: '/',
      destination: '/admin',
      permanent: false,
    },
    {
      // internet explorer
      destination: '/ie-incompatible.html',
      has: [
        {
          type: 'header',
          key: 'user-agent',
          value: '(.*Trident.*)', // all ie browsers
        },
      ],
      permanent: false,
      source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
    },
  ]
}

export default redirects
