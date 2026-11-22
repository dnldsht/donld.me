---
title: From the 1Password operator to External Secrets
date: 2026-11-22
description: Why I moved my homelab secrets to External Secrets Operator, and what got simpler.
tags: [k8s, secrets]
---

My homelab runs on k3s with Flux. Every password, token and API key lives in a 1Password vault. For a long time the 1Password Connect operator turned those items into Kubernetes Secrets. In October I replaced it with [External Secrets Operator](https://external-secrets.io) (ESO). The vault got smaller, and each item now holds only raw values.

## The problem both tools solve

Apps on Kubernetes read passwords from a `Secret`. You don't want those values in git, so you keep them in a password manager and run an operator that copies them into the cluster. Both tools do that. They differ in how much control you get over the copy.

## How the 1Password operator works

You create a `OnePasswordItem` and the operator copies the whole item into a Secret, field by field:

```yaml
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: grafana-oauth-secret
  namespace: monitoring
spec:
  itemPath: "vaults/beans/items/grafana-oauth"
```

Very simple, but not really flexible. The Secret mirrors the item 1:1: field name becomes key, field value becomes value. If your app wants a key called `GF_AUTH_GENERIC_OAUTH_CLIENT_SECRET`, you must name the 1Password field that way. If it wants a connection string, you paste a connection string into 1Password. From the manifest you can't tell which fields the app reads.

## How ESO works

ESO splits the job in two. A `ClusterSecretStore` says how to reach 1Password, once, for the whole cluster:

```yaml
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: onepassword
spec:
  provider:
    onepasswordSDK:
      vault: beans
      auth:
        serviceAccountSecretRef:
          name: onepassword-token
          key: token
          namespace: external-secrets
```

Then each app gets an `ExternalSecret`. It has two parts:

- `data` picks single fields from 1Password, written as `item/field`, and gives each a short name.
- `target.template` builds the final Secret from those names. You can mix in plain text, rename keys, and glue values together.

The examples below show what that buys you.

## Example 1: Grafana

Grafana needs a Postgres password and an OIDC client secret for login.

**Before.** Two items, with fields named after what Grafana expects:

```text
grafana-postgres
  username                              grafana
  password                              ••••••••

grafana-oauth
  GF_AUTH_GENERIC_OAUTH_CLIENT_ID       609689fd-dd30-…
  GF_AUTH_GENERIC_OAUTH_CLIENT_SECRET   ••••••••
```

Plus two `OnePasswordItem` manifests. Half of those fields aren't secret: the username and the client ID sit in the vault only because the operator can't add anything on its own.

**After.** One item, two raw values:

```text
grafana
  db-password          ••••••••
  oidc-client-secret   ••••••••
```

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: grafana-secrets
  namespace: monitoring
spec:
  refreshInterval: 24h
  secretStoreRef: { kind: ClusterSecretStore, name: onepassword }
  target:
    template:
      engineVersion: v2
      data:
        username: grafana
        password: "{{ .db }}"
        GF_AUTH_GENERIC_OAUTH_CLIENT_SECRET: "{{ .oidc }}"
  data:
    - { secretKey: db,   remoteRef: { key: grafana/db-password } }
    - { secretKey: oidc, remoteRef: { key: grafana/oidc-client-secret } }
```

The username lives in the template, the client ID moved to Grafana's Helm values. Both are in git now, where they belong.

## Example 2: pulling private images from GHCR

A few of my apps use private images on GitHub's registry. Kubernetes needs an image pull Secret of type `dockerconfigjson`, and that Secret must exist in every namespace that pulls.

**Before.** The item held one field literally named `.dockerconfigjson`, with JSON I built by hand around the token (the token is repeated inside `auth`, base64-encoded together with the username):

```text
ghcr-pull
  .dockerconfigjson   {"auths":{"ghcr.io":{"username":"dnldsht","password":"ghp_••••","auth":"ZG5sZHNodDpnaHBf••••"}}}
```

Then each namespace got its own copy of this manifest:

```yaml
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: ghcr-pull
  namespace: spesa-beans
type: kubernetes.io/dockerconfigjson
spec:
  itemPath: "vaults/beans/items/ghcr-pull"
```

**After.** The item stores the token, nothing else:

```text
ghcr-pull
  token   ghp_••••••••
```

One `ClusterExternalSecret` builds the JSON and copies the Secret into every namespace with a label:

```yaml
apiVersion: external-secrets.io/v1
kind: ClusterExternalSecret
metadata:
  name: ghcr-pull
spec:
  namespaceSelectors:
    - matchLabels: { secrets.donld.me/ghcr-pull: "true" }
  externalSecretSpec:
    refreshInterval: 24h
    secretStoreRef: { kind: ClusterSecretStore, name: onepassword }
    target:
      name: ghcr-pull
      template:
        type: kubernetes.io/dockerconfigjson
        engineVersion: v2
        data:
          .dockerconfigjson: '{"auths":{"ghcr.io":{"username":"dnldsht","password":"{{ .token }}","auth":"{{ printf "dnldsht:%s" .token | b64enc }}"}}}'
    data:
      - { secretKey: token, remoteRef: { key: ghcr-pull/token } }
```

A new private app adds one label to its namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: spesa-beans
  labels:
    secrets.donld.me/ghcr-pull: "true"
```

## Example 3: LibreDB Studio

LibreDB Studio is a web UI for my databases. I preload it with a connection to each Postgres in the cluster, so it needs seven database passwords.

**Before.** The `libredb` item held its own secrets plus a hand-made copy of every other app's password:

```text
libredb
  JWT_SECRET              ••••••••
  OIDC_CLIENT_ID          740fba03-…
  OIDC_CLIENT_SECRET      ••••••••
  ATUIN_DB_PASSWORD       ••••••••   ← copy of the atuin item
  FORGEJO_DB_PASSWORD     ••••••••   ← copy of the forgejo item
  GRAFANA_DB_PASSWORD     ••••••••   ← copy of grafana-postgres
  IMMICH_DB_PASSWORD      ••••••••   ← …
  NOTION_IO_DB_PASSWORD   ••••••••
  POCKET_ID_DB_PASSWORD   ••••••••
  UMAMI_DB_PASSWORD       ••••••••
```

Rotate the Grafana password and LibreDB keeps the old one until you remember this item exists.

**After.** The item keeps only what belongs to LibreDB. The rest comes straight from the other apps' items:

```text
libredb
  jwt-secret           ••••••••
  oidc-client-secret   ••••••••
```

```yaml
  # target.template as in the Grafana example
  data:
    - { secretKey: jwt,     remoteRef: { key: libredb/jwt-secret } }
    - { secretKey: oidc,    remoteRef: { key: libredb/oidc-client-secret } }
    - { secretKey: grafana, remoteRef: { key: grafana/db-password } }
    - { secretKey: immich,  remoteRef: { key: immich/db-password } }
    # … one line per database
```

One `ExternalSecret` can read from any number of items. A password lives in one place, and every app that needs it reads it from there.

## Example 4: backup credentials

My backups go to Backblaze B2 from two tools: CloudNativePG (Postgres) and K8up (volumes).

**Before.** The same B2 key sat in two items, with different field names because each tool wanted its own:

```text
b2-backup                          k8up-b2
  ACCESS_KEY_ID       ••••           accessKeyID       ••••
  ACCESS_SECRET_KEY   ••••           secretAccessKey   ••••
                                     resticPassword    ••••
```

Every Postgres cluster declared its own `OnePasswordItem` for `b2-backup`, and my K8up Helm chart had a template that rendered one more per backend in each namespace.

**After.** One item per destination with the same field names everywhere (`backup-b2`, `backup-garage`, `backup-abbahome`):

```text
backup-b2
  access-key-id       ••••
  secret-access-key   ••••
  restic-password     ••••
```

A `ClusterExternalSecret` works like the GHCR one: a namespace adds `secrets.donld.me/backup-b2: "true"` and gets the Secret. I deleted the template from the chart and every per-namespace item. That commit removed about 200 lines.

## The wins

- **One item per service, raw values only.** The vault holds what I generate or what a provider hands me. Connection strings, JSON and key names get built in git.
- **Each value lives in one place.** No copies to forget during a rotation.
- **Shared credentials by label.** A new app needs one line to get GHCR or backup access.
- **Not tied to 1Password.** ESO also speaks Vault, AWS, GCP, Bitwarden and more. If I leave 1Password, I swap the store and keep every `ExternalSecret`.

## Migrating without downtime

I went service by service. For the risky ones I added the `ExternalSecret` next to the old `OnePasswordItem`, pointed the app at the new Secret, checked it worked, then removed the old item in a second commit. With Flux pruning deleted manifests, the two-step version gives you a moment to roll back.

## Gotchas

- **Mind the rate limits.** The SDK provider calls 1Password on every refresh, and service accounts have hourly and daily request limits. I set `refreshInterval: 24h` on every `ExternalSecret` to stay well inside them.
- **Restart after rotating.** With a 24h interval a rotated value can take a day to arrive. Force it with `kubectl annotate externalsecret <name> force-sync=$(date +%s) --overwrite`. Env vars still need `kubectl rollout restart`, as with any Secret.
- **Item titles must be unique.** ESO looks items up by name and fails on duplicates. To replace an item, create `<name>-new`, rename the old one to `<name>-legacy`, then rename the new one.

If your 1Password items have grown fields that only exist to please one app's config format, try ESO. Fix those items first, since they'll save you the most work.
