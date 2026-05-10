# 🎨 Guia Visual e Layout - ImóvelPro

## 🌈 Paleta de Cores

### Cores Primárias
```
Azul da Meia Noite:  #0D1B40 (Texto, Headlines)
Azul Médio:          #2563EB (Botões Primários)
Azul Claro:          #5DADE2 (Acentos, Links)
Branco:              #FFFFFF (Fundo)
```

### Cores Secundárias
```
Off-White:           #F8FAFF (Fundo secundário)
Cinza 50:            #F0F4FF
Cinza 100:           #E1E9FF
Cinza 400:           #8898C0 (Texto desativado)
Cinza 600:           #4A5978 (Texto secundário)
Cinza 800:           #1E2B4A (Texto terciário)
```

### Cores Semânticas
```
Sucesso:  #10B981 (Verde)
Aviso:    #F59E0B (Laranja)
Perigo:   #EF4444 (Vermelho)
Info:     #3B82F6 (Azul)
```

## 📐 Tipografia

### Fonte Principal
**Inter** - Google Fonts
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Tamanhos
- H1: 28px / 700 weight
- H2: 24px / 600 weight
- H3: 20px / 600 weight
- Body: 14px / 400 weight
- Small: 12px / 500 weight

## 📏 Espaçamento

### Escala de Espaçamento
```
4px   - xs (pequenos detalhes)
8px   - sm (espaço pequeno)
12px  - md (espaço médio)
16px  - lg (espaço grande)
20px  - xl (espaço muito grande)
24px  - 2xl (espaço enorme)
```

## 🔘 Componentes

### Botões

#### Primário
```css
Background: Linear Gradient (Blue Mid → Midnight Light)
Color: White
Padding: 10px 20px
Border Radius: 12px
Shadow: 0 4px 14px rgba(37, 99, 235, 0.3)
```

#### Secundário
```css
Background: White
Color: Midnight
Border: 1.5px solid Gray 200
Padding: 10px 20px
Border Radius: 12px
```

#### Perigo
```css
Background: Danger BG
Color: Danger
Border: 1.5px solid rgba(239, 68, 68, 0.2)
Padding: 10px 20px
Border Radius: 12px
```

#### Tamanhos
- **SM**: 6px 14px / 13px
- **MD**: 10px 16px / 14px (padrão)
- **LG**: 14px 28px / 16px

### Cards

```css
Background: White
Border: 1px solid rgba(13, 27, 64, 0.06)
Border Radius: 16px
Padding: 24px
Box Shadow: 0 1px 3px rgba(13, 27, 64, 0.08)
```

### Inputs

```css
Padding: 10px 14px
Border: 1.5px solid Gray 200
Border Radius: 12px
Font Size: 14px
Background: White

Focus:
  Border Color: Blue Light
  Box Shadow: 0 0 0 3px rgba(93, 173, 226, 0.2)
```

### Modal

```css
Overlay:
  Background: rgba(13, 27, 64, 0.5)
  Backdrop Filter: blur(4px)

Modal:
  Background: White
  Border Radius: 24px
  Padding: 32px
  Max Width: 600px
  Box Shadow: 0 20px 60px rgba(13, 27, 64, 0.20)
```

## 📱 Responsive Breakpoints

```css
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
```

### Media Queries
```css
@media (max-width: 768px) {
  /* Estilos para mobile/tablet */
}

@media (max-width: 1024px) {
  /* Estilos para tablet */
}

@media (min-width: 1025px) {
  /* Estilos para desktop */
}
```

## 🎯 Layout Principal

### Estrutura Desktop
```
┌─────────────────────────────────┐
│  Sidebar   │  Navbar             │
├────────────┼─────────────────────┤
│            │                     │
│  Nav       │  Conteúdo Principal │
│  Items     │                     │
│            │                     │
└────────────┴─────────────────────┘
```

### Sidebar
- Largura: 260px (fixa)
- Background: Midnight
- Cor: White
- Items com hover: Blue Light
- Active: Background Blue Mid

### Navbar (Dentro do Dashboard)
- Altura: 64px
- Background: White
- Border Bottom: 1px Gray 100
- Conteúdo Centralizado

## 📋 Página Padrão

### Header
```
H1 (Título)
P (Subtítulo/Descrição)
Ação (Botão Primário)
```

### Conteúdo
```
Filtros (Busca + Selects)
│
Card/Tabela com Dados
│
Paginação (se houver muitos dados)
```

## 📊 Dashboard Layout

```
┌─────────────────────────────────┐
│ Bem-vindo, João!               │  (Header)
├─────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │ 150 │ │ 45  │ │ 12  │ │ R$5M│ │  (Cards Stats)
│ │Imóv.│ │Cli. │ │Vis. │ │Port.│ │
│ └─────┘ └─────┘ └─────┘ └─────┘ │
├─────────────────────────────────┤
│ Próximas Visitas:                │  (Section)
│ ┌──────────────────────────────┐ │
│ │ Imóvel | Cliente | Data/Hora │ │  (Table)
│ ├──────────────────────────────┤ │
│ │ ...                          │ │
│ └──────────────────────────────┘ │
└─────────────────────────────────┘
```

## 🎨 Estado de Componentes

### Hover
```css
Background: Ligeiramente mais claro
Transform: translateY(-2px)
Box Shadow: Aumenta
```

### Focus
```css
Border Color: Blue Light
Box Shadow: 0 0 0 3px rgba(93, 173, 226, 0.2)
Outline: None
```

### Active
```css
Transform: scale(0.98)
Background: Mais escuro
```

### Disabled
```css
Opacity: 0.6
Cursor: not-allowed
Transform: none
```

## 🔤 Badges/Labels

### Status
```
AGENDADA   → Blue Badge
REALIZADA  → Green Badge
CANCELADA  → Red Badge
```

### Tipo Imóvel
```
CASA       → Midnight Badge
APARTAMENTO → Blue Badge
TERRENO    → Gray Badge
```

## 📈 Animações

### Transições Padrão
```css
transition: 0.2s ease;
```

### Fade In
```css
animation: fadeIn 0.3s ease;
```

### Slide Up
```css
animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

## 🌗 Dark Mode (Futuro)

Preparação para modo escuro:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --white: #1A1D23;
    --midnight: #F5F7FA;
    /* ... */
  }
}
```

## 📸 Screenshots/Mockups

### Landing Page
- Hero com gradient
- Seções com cards
- Call-to-action buttons
- Footer

### Login
- Form centered
- Logo
- Link para registro
- Password reset (futuro)

### Dashboard
- Sidebar à esquerda
- Main content área
- Stats cards
- Table/List

### Modal
- Title
- Content scrollable
- Action buttons
- Close button

## 🎯 Hierarquia Visual

1. **Mais Importante**: Blue Mid (botões primários)
2. **Importante**: Midnight (títulos)
3. **Informação**: Gray 600 (textos)
4. **Secundário**: Gray 400 (textos desativados)
5. **Background**: Off-White ou White

## ♿ Acessibilidade

### Cores
- Contraste suficiente (WCAG AA)
- Não confiar apenas em cor (usar ícones/texto)

### Interação
- Focus states visíveis
- Hover states claros
- Keyboard navigation

### Texto
- Alt text em imagens
- Labels em inputs
- Semantic HTML

## 🖼️ Ícones

Usando **Lucide React**:
```tsx
import { Home, Users, Calendar } from 'lucide-react'

<Home size={20} />
<Users size={20} />
<Calendar size={20} />
```

---

**Mantenha a consistência visual do projeto seguindo este guia!** 🎨
