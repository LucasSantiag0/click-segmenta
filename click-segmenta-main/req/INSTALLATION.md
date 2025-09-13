# ClickSegmenta Dashboard - Guia de Instalação

## 📋 Pré-requisitos

### Para o Frontend (Next.js/React)
- Node.js 18+ 
- npm ou yarn
- Git

### Para Análise de Dados (Python - Opcional)
- Python 3.9+
- pip

## 🚀 Instalação Rápida

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/clicksegmenta-dashboard.git
cd clicksegmenta-dashboard
\`\`\`

### 2. Instale as dependências do Frontend
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

### 3. Configure as variáveis de ambiente
\`\`\`bash
cp environment.example.json .env.local
# Edite o arquivo .env.local com suas configurações
\`\`\`

### 4. Execute o projeto
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

O dashboard estará disponível em: http://localhost:3000

## 🐍 Configuração Python (Opcional)

### Para análise de dados e machine learning:

\`\`\`bash
# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt
\`\`\`

## 🐳 Docker (Opcional)

### Execute com Docker Compose:
\`\`\`bash
docker-compose up -d
\`\`\`

## 📊 Estrutura do Projeto

\`\`\`
clicksegmenta-dashboard/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
├── contexts/              # Context API
├── lib/                   # Utilitários
├── public/                # Arquivos estáticos
├── styles/                # Estilos CSS
├── data/                  # Dados de exemplo
├── scripts/               # Scripts Python
├── package.json           # Dependências Node.js
├── requirements.txt       # Dependências Python
└── README.md             # Documentação
\`\`\`

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
\`\`\`

## 📈 Funcionalidades

- ✅ Dashboard Principal com KPIs
- ✅ Análise de Segmentos
- ✅ Clientes por Cluster
- ✅ Análise de Rotas
- ✅ Filtros Interativos
- ✅ Gráficos Responsivos
- ✅ Design Dark Mode
- ✅ Tema ClickBus

## 🎨 Tecnologias Utilizadas

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Radix UI
- Lucide Icons

### Backend (Opcional)
- Python
- Pandas
- Scikit-learn
- FastAPI
- PostgreSQL
- Redis

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Abra uma issue no GitHub
3. Entre em contato com a equipe
