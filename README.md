# FIAP - Hackaton - Mobile

Este repositório é referente ao desenvolvimento mobile do hackaton. Aqui você encontrará tudo que precisa pra executar o projeto, instalar novos módulos,etc. 


## Primeiros passos

### Pré Requisitos

Antes de iniciar o projeto, certifique-se de ter as seguintes tecnologias instaladas:

- **Node.js** (>= 18.x) – runtime JavaScript/TypeScript.
- **npm** (>= 9.x) ou **yarn** – gerenciador de pacotes.
- **Expo CLI** (>= 48.x) – para rodar e construir o app, instalado globalmente com `npm install -g expo-cli`.
- **Android Studio** e/ou **Xcode** (macOS) – emuladores/simuladores para testar em dispositivos.
- **Git** – controle de versão.

> 💡 Versões acima são as recomendadas durante o desenvolvimento. Pode funcionar com versões mais novas, mas verifique a compatibilidade do Expo.

### Tecnologias utilizadas

Este aplicativo móvel é construído com as seguintes principais tecnologias:

- **React Native** com **Expo** (router de arquivos).
- **TypeScript** para tipagem estática.
- **AsyncStorage** e **Firebase** para persistência e autenticação.
- **Jest** e **React Testing Library** para testes.
- Arquitetura limpa (Domain, Use Cases, Repositories, Infrastructure, Presentation).

### Passo a passo para instalação em nova máquina

1. Clone o repositório:

   ```bash
   git clone <repo-url> mobile
   cd mobile
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou yarn install
   ```

3. Crie ou configure o arquivo `firebaseConfig.ts` com suas credenciais do Firebase.

4. Inicie o Metro bundler/expo:

   ```bash
   npx expo start
   ```

5. Escolha a forma de execução na interface do Expo (emulador Android, simulador iOS, Expo Go etc.).

6. Para limpar caches ou reiniciar com estado limpo (útil em novas máquinas):

   ```bash
   npm run reset-project
   ```

7. Comece a desenvolver editando os arquivos em **app/**.

### Estrutura do Projeto
 
 ```bash

├── app/
│   ├── _layout.tsx
│   ├── forgot-password.tsx
│   ├── index.tsx
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   ├── task-creation.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── home.tsx
│       ├── preferences.tsx
│       └── tasks.tsx
└── src/
    ├── data/
    │   ├── index.ts
    │   ├── dtos/
    │   │   └── task/
    │   │       ├── CreateTaskDTO.ts
    │   │       └── ResponseTaskDTO.ts
    │   └── mappers/
    │       ├── task/
    │       │   ├── TaskMapper.spec.ts
    │       │   └── TaskMapper.ts
    │       └── user/
    │           ├── UserMapper.spec.ts
    │           └── UserMapper.ts
    ├── domain/                                                      ← Domínio
    │   ├── index.ts
    │   ├── entities/                                                ← Aqui estão as entidades do projeto mobile
    │   │   ├── Session.spec.ts
    │   │   ├── Session.ts
    │   │   ├── Task.spec.ts
    │   │   ├── Task.ts
    │   │   ├── User.spec.ts
    │   │   └── User.ts
    │   ├── enums/
    │   │   ├── TaskStatus.ts
    │   │   └── TimeType.ts
    │   ├── repositories/
    │   │   ├── AuthRepository.ts
    │   │   ├── LoggerRepository.ts
    │   │   ├── SessionRepository.ts
    │   │   ├── StorageRepository.ts
    │   │   └── TaskRepository.ts
    │   └── usecases/                                                 ← UseCases - referente às regras de negócios
    │       ├── home/
    │       │   ├── GetTaskProgressUseCase.ts
    │       │   └── GetTotalFocusTimeUseCase.ts
    │       ├── task/
    │       │   ├── CreateTaskUseCase.spec.ts
    │       │   └── … (others)
    │       └── user/
    │           └── … (use cases)
    ├── infrastructure/                                              ← Infraestrutura
    │   ├── error-handler.ts
    │   ├── index.ts
    │   └── repositories/
    │       ├── AsyncStorageRepository.spec.ts
    │       ├── AsyncStorageRepository.ts
    │       ├── FirebaseAuthRepository.spec.ts
    │       ├── FirebaseAuthRepository.ts
    │       ├── FirebaseTaskRepository.spec.ts
    │       ├── FirebaseTaskRepository.ts
    │       ├── InMemoryLoggerRepository.spec.ts
    │       ├── InMemoryLoggerRepository.ts
    │       ├── InMemorySessionRepository.spec.ts
    │       └── InMemorySessionRepository.ts
    └── presentation/                                                 ← Apresentação
        ├── assets/
        │   └── images/
        ├── components/
        │   ├── forgot-password/
        │   │   └── smart/
        │   ├── home/
        │   ├── preferences/
        │   ├── register-task/
        │   ├── shared/
        │   ├── sign-in/
        │   ├── sign-up/
        │   └── tasks/
        ├── constants/
        │   ├── index.ts
        │   ├── paper-theme.ts
        │   ├── spacing.ts
        │   ├── theme.ts
        │   └── typography.ts
        ├── contexts/
        │   ├── DependenciesContext.spec.tsx
        │   ├── DependenciesContext.tsx
        │   ├── SessionContext.spec.tsx
        │   ├── SessionContext.tsx
        │   ├── TaskContext.spec.tsx
        │   ├── TaskContext.tsx
        │   ├── ThemeContext.spec.tsx
        │   ├── ThemeContext.tsx
        │   ├── UserContext.spec.tsx
        │   └── UserContext.tsx
        └── hooks/
            ├── use-color-scheme.ts
            ├── use-color-scheme.web.spec.ts
            ├── use-color-scheme.web.ts
            ├── use-theme-color.spec.ts
            ├── use-theme-color.ts
            ├── use-theme-colors.spec.ts
            └── use-theme-colors.ts
 ```

#### Onde Adicionar novos componentes
Seguindo as normas da Clean Architecture, cada tipo de serviço, componente ou utilitário tem seu lugar definido.
Use os exemplos abaixo para entender onde as novas peças do sistema devem viver.

- **Apresentação (presentation)**
  - Responsável por tudo que está ligado à UI e à interação do usuário.
  - Exemplo: um novo componente React para a tela de perfil, hooks de formulário (`useProfileForm`), ou contextos (`ProfileContext`).
  - Nesta camada também ficam estilos, temas e componentes reutilizáveis.

- **Domínio (domain)**
  - Abriga as regras de negócio independentes de framework e de plataforma.
  - Adicione aqui entidades (por exemplo, `User`, `Task`), interfaces de repositório, casos de uso (`CreateTaskUseCase.ts`) e enums.
  - Se você precisa modelar lógica ou validações que não dependem de Expo/React, coloque no domínio.

- **Infraestrutura (infrastructure)**
  - Implementações concretas para persistência, redes, armazenamento e serviços externos.
  - Exemplos: repositórios que usam Firebase (`FirebaseTaskRepository.ts`), adaptadores de AsyncStorage, ou um gerenciador de logs.
  - Esta camada sabe “como” fazer algo, enquanto o domínio apenas define “o que” precisa ser feito.

> 💡 Ao criar um novo recurso, pense primeiro em sua responsabilidade e escolha a camada adequada. Isso mantém o código modular, testável e fácil de manter.

#### Extra - Comandos Úteis
 ```bash
# Executar testes unitários
npm test

# Gerar build de produção
npm run build

# Executar linting
npm run lint

# Gerar documentação
npm run docs

# Rodar no emulador/dispositivo Android
npx expo run:android

# Rodar no simulador/dispositivo iOS (macOS apenas)
npx expo run:ios

# Abrir o app no Expo Go (exemplo)
npx expo start --tunnel
```