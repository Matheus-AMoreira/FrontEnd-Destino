## SSL Certs usando OpenSSL
OpenSSL pode ser instalado como via cholatey também.

O node não vai permitir https request para o backend sem ter os certificados no frontend nem abrir por conta que o vite esperar o certificados na parta certs.

local.conf possui uma configuração de certificado para desenvolvimento local você pode rodar o comando abaixo para gerar eles.

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certs/server.key -out ./certs/server.cert -config local.conf -extensions v3_req

O node não vai permitir https request para o backend sem ter os certificados no frontend e lembre que colocar o certificado na lista do de certificados confiaveis do sistema operacional.

# Instalação do mkcert (via Chocolatey)

Se você está usando o Windows, o (Chocolatey)[https://community.chocolatey.org/] é o gerenciador de pacotes mais simples para instalar o (mkcert)[https://github.com/FiloSottile/mkcert].

Pré-requisito: Instalar o Chocolatey
Se você ainda não tem o Chocolatey, abra o PowerShell como Administrador e execute o seguinte comando:

> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

Instalar o mkcert
Com o Chocolatey instalado, instale o mkcert executando no terminal:

> choco install mkcert

# Instalação da Autoridade Certificadora Local (CA)

O mkcert precisa ser configurado uma única vez para criar sua própria Autoridade Certificadora (CA) e instalá-la no seu sistema operacional e navegadores. Isso garante que os certificados gerados sejam confiáveis.
Execute o comando:

> mkcert -install

# Geração do Certificado SSL/TLS

Agora você pode gerar o par de certificado e chave privada para o seu ambiente de desenvolvimento (localhost).

a. Criar a Pasta de Destino
Navegue até a raiz do seu projeto e crie a pasta certs onde os arquivos serão salvos.

- mkdir certs
- cd certs

b. Gerar o Certificado
Execute o mkcert especificando onde salvar o certificado (.pem) e a chave (-key.pem).

> mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1

# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
