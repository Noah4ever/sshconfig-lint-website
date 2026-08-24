# sshconfig-lint website

Privacy-first browser playground and documentation for [sshconfig-lint](https://github.com/Noah4ever/sshconfig-lint).

## Local development

```sh
npm ci
npm run dev
```

## Production

The included Dockerfile builds a standalone Next.js server on port 3000. It is ready for a GitHub-based Coolify deployment.

```sh
docker build -t sshconfig-lint-web .
docker run --rm -p 3000:3000 sshconfig-lint-web
```

Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin when using a domain other than `https://sshconfig-lint.apps.thiering.org`.
