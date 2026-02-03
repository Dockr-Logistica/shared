# Shared - Componentes e Lógica Compartilhada

Diretório contendo componentes React, hooks, tipos e utilitários compartilhados entre as aplicações.

## Estrutura

```
shared/
├── components/          # Componentes React reutilizáveis
├── hooks/              # Custom hooks para lógica compartilhada
├── types/              # Tipos TypeScript compartilhados
├── utils/              # Funções utilitárias
├── styles/             # Arquivos CSS globais (design tokens)
└── index.ts            # Exportações principais
```

## Componentes

### Componentes Base
- **Button** - Botão com múltiplas variantes
- **Input** - Campo de entrada com suporte a máscaras
- **Select** - Dropdown com opciones
- **Card** - Componente de cartão com subcomponentes
- **Badge** - Badge com variantes de cor
- **Avatar** - Avatar com status e fallback
- **Modal** - Modal responsivo
- **Skeleton** - Placeholder de carregamento
- **Toggle** - Switch com label
- **ProgressBar** - Barra de progresso
- **DataTable** - Tabela genérica

### Componentes Compostos
- **TextButton** - Botão como link ou button
- **Logo** - Logo do Dockr
- **StepIndicator** - Indicador de passos
- **CargoCard** - Card para carga/mercadoria
- **RouteCard** - Card para rota

## Hooks

### API
- **api** - Cliente Axios pré-configurado
- **apiClient** - Cliente com autenticação
- **queryClient** - Cliente React Query configurado
- **useAPI** - Hook para chamadas API padrão
- **useBlockingAPI** - Hook para chamadas que bloqueiam UI

### Serviços
- **authService** - Serviço de autenticação
- **quoteService** - Serviço de cotações

## Tipos

- **carrier** - Tipos relacionados a transportadoras
- **route** - Tipos de rotas
- **user** - Tipos de usuários
- **warehouse** - Tipos de armazéns

## Utils

- **cn** - Função para mesclar classes Tailwind (clsx + twMerge)

## Styles

- **design-tokens.css** - Variáveis CSS (cores, espaçamento, tipografia)

## Como Usar

### Importar Componente
```typescript
import { Button, Card, Input } from '@/shared'

export default function MyComponent() {
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button>Enviar</Button>
    </Card>
  )
}
```

### Importar Hook
```typescript
import { useAPI } from '@/shared'

export default function MyComponent() {
  const { execute, data, loading } = useAPI()

  return (
    <button onClick={() => execute(() => api.get('/data'))}>
      {loading ? 'Carregando...' : 'Carregar'}
    </button>
  )
}
```

### Importar Tipo
```typescript
import type { UserResponse } from '@/shared'

const user: UserResponse = {
  id: '1',
  email: 'user@example.com',
  // ...
}
```

## Configuração do TypeScript

Certifique-se de que o `tsconfig.json` tem o alias configurado:

```json
{
  "compilerOptions": {
    "paths": {
      "@/shared": ["shared/index.ts"]
    }
  }
}
```

## Desenvolvendo Novos Componentes

1. Crie o arquivo do componente em `/shared/components`
2. Use CVA (class-variance-authority) para variantes
3. Use `cn()` para mesclar classes
4. Exporte do `components/index.ts`
5. Adicione tipos TypeScript adequados

Exemplo:
```typescript
import { forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const myVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-styles',
      primary: 'primary-styles',
    },
  },
})

export interface MyComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myVariants> {}

const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant, className, ...props }, ref) => (
    <div ref={ref} className={cn(myVariants({ variant }), className)} {...props} />
  )
)

MyComponent.displayName = 'MyComponent'

export { MyComponent, myVariants }
```

## Padrões e Convenções

- **Componentes**: PascalCase
- **Hooks**: camelCase com prefixo `use`
- **Tipos**: PascalCase com sufixo `Type` ou `Response`
- **Arquivos**: PascalCase para componentes, camelCase para utilitários
- **Estilos**: Usar design tokens via variáveis CSS
- **Animações**: `transition: all 0.2s ease-in-out` em componentes interativos
