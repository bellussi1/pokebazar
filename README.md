# ⚡ PokéBazar

> **Pokémon Draft Battle** — monte sua equipe em um leilão, economize seus pontos e enfrente uma campanha contra um BOT que também pensa no orçamento.

[![Jogar online](https://img.shields.io/badge/Jogar%20agora-GitHub%20Pages-f7b74d?style=for-the-badge&logo=github&logoColor=101827)](https://bellussi1.github.io/pokebazar/)
[![Licença](https://img.shields.io/badge/Projeto-fan--made-86d6bd?style=for-the-badge)](#aviso-sobre-pokémon)

## 🎮 Sobre o jogo

PokéBazar é um jogo web de estratégia inspirado em Pokémon. Em cada partida, você recebe uma quantidade limitada de pontos e disputa Pokémon em um leilão dinâmico. Depois de montar sua equipe, escolhe a ordem de entrada e acompanha uma batalha automática baseada em tipos, atributos, velocidade, golpes e status.

O jogo foi pensado para partidas repetíveis: os lotes, os preços, o comportamento do BOT e os desafios da campanha mudam a cada tentativa.

## ▶️ Jogar

**Versão publicada:** [bellussi1.github.io/pokebazar](https://bellussi1.github.io/pokebazar/)

Também é possível executar localmente abrindo `index.html` no navegador. Para uma experiência mais confiável com a PokéAPI, use um servidor local simples.

```powershell
py -m http.server 8000
```

Depois, acesse <http://localhost:8000>.

## 🧭 Como jogar

### 1. Prepare sua aventura

Escolha seu nome, a geração disponível e a dificuldade do BOT. O jogo começa com **20 pontos** e permite Pokémon das gerações I a VI, até o #721.

### 2. Sorteie um Pokémon

Cada lote revela um Pokémon novo. A imagem, os tipos, os atributos, o preço e os golpes são carregados pela [PokéAPI](https://pokeapi.co/).

Pokémon não se repetem na mesma partida. Se o primeiro lote não interessar, você pode:

- **Pular** o Pokémon;
- **Sortear novamente**, limitado pela dificuldade:
  - Normal: 3 vezes;
  - Médio: 2 vezes;
  - Difícil: 1 vez.

### 3. Dispute o leilão

Quando for sua vez, aumente o lance em um ponto ou passe. O BOT analisa o lote e decide se vale a pena competir.

O BOT considera, entre outros fatores:

- Base Stat Total e distribuição dos atributos;
- Tipos e cobertura da equipe;
- Velocidade, ataque, defesa e funções de combate;
- Raridade e valor do Pokémon;
- Pontos restantes e reserva necessária para completar o time;
- Personalidade e estratégia sorteadas para a partida.

Ele pode economizar, desistir de Pokémon medianos ou disputar uma estrela quando considerar que o investimento vale o risco.

### 4. Monte sua equipe

Cada jogador pode ter até **seis Pokémon**. A batalha começa quando:

- ambos completam seis Pokémon; ou
- ambos não conseguem mais comprar novos Pokémon com os pontos restantes.

Por isso, uma equipe pode ter menos de seis integrantes quando o orçamento acabar. A partida não fica presa esperando espaços que não podem ser preenchidos.

### 5. Escolha a ordem

Antes da batalha, clique nos Pokémon na ordem em que eles devem entrar. Também é possível reorganizar a ordem arrastando os cards.

O BOT escolhe sua própria ordem de acordo com velocidade, funções, cobertura e estratégia da fase.

### 6. Assista à batalha

A batalha é automática. O Pokémon vencedor continua em campo com o HP restante até ser derrotado. O próximo Pokémon da ordem entra em seguida.

O resultado de cada turno considera:

- Velocidade para definir quem age primeiro;
- Attack, Defense, Special Attack e Special Defense;
- Golpes físicos e especiais;
- STAB — bônus por usar um golpe do próprio tipo;
- Fraquezas, resistências e imunidades;
- Acertos críticos;
- Queimadura, veneno, paralisia, sono e congelamento;
- Dano residual e efeitos aplicados pelos golpes.

## 🏆 Campanha

No modo BOT, cada vitória libera uma nova fase:

- 8 Ginásios;
- 4 membros da Elite Four;
- 1 Campeão final.

Cada adversário possui tema, personalidade e abordagem própria — como velocidade, pressão ofensiva, defesa pesada, controle de status ou cobertura de tipos.

Há também desafios especiais, como a **Caixa econômica**, que recompensa terminar o draft gastando poucos pontos.

## ⚙️ Configurações

No menu de configurações, você pode ajustar:

- Nome do treinador;
- Geração máxima da Pokédex;
- Dificuldade do BOT;
- Velocidade da batalha;
- Sons e volume;
- Música do menu;
- Alto contraste.

O jogo salva automaticamente a partida, as configurações e o ranking no `localStorage` do navegador. O ranking é local: ele não é compartilhado entre computadores ou navegadores.

## 🌐 Dados e funcionamento offline

O jogo usa a PokéAPI para buscar dados dos Pokémon e mantém um cache local para acelerar partidas futuras. Se a API estiver indisponível, o jogo tenta usar dados já armazenados no navegador.

Como é uma aplicação estática, não existe servidor próprio para partidas online neste momento. O modo atualmente desenvolvido e recomendado é **contra BOT**.

## 🚀 Deploy no GitHub Pages

O projeto possui um workflow em `.github/workflows/pages.yml` que:

1. Baixa o repositório;
2. Executa `node minify-html.js`;
3. Gera o site em `dist/`;
4. Publica o artefato no GitHub Pages.

Para ativar corretamente:

1. Abra **Settings → Pages** no repositório;
2. Em **Build and deployment → Source**, selecione **GitHub Actions**;
3. Faça push na branch `main` ou execute o workflow manualmente na aba **Actions**.

O arquivo `dist/index.html` é gerado no deploy e está no `.gitignore`. O código-fonte de desenvolvimento permanece em `index.html`.

### Minificação e privacidade do código

A minificação reduz o tamanho do HTML, CSS e JavaScript e deixa o arquivo mais compacto. Ela **não esconde** o código: qualquer JavaScript executado no navegador pode ser inspecionado pelo usuário.

Não coloque chaves secretas, senhas ou regras sensíveis no frontend. Para proteger lógica realmente privada, seria necessário mover essa parte para um backend.

## 💛 Apoie o projeto

Se o PokéBazar for útil ou divertido, você pode apoiar o desenvolvimento:

- [Buy Me a Coffee](https://www.buymeacoffee.com/bellussi)
- Pix: `6d639344-ce33-48ff-b2ba-649096353372`

## 🗂️ Estrutura principal

```text
pokebazar/
├── index.html                 # Aplicação completa: interface, regras e batalha
├── minify-html.js             # Gera o bundle compacto para produção
├── .github/workflows/
│   └── pages.yml              # Deploy automático no GitHub Pages
├── .nojekyll                  # Evita processamento Jekyll
└── dist/                      # Saída gerada no build (não versionada)
```

## 🧪 Verificações locais

Antes de publicar uma alteração, é recomendado executar:

```powershell
node minify-html.js
node --check minify-html.js
git diff --check
```

## ⚖️ Aviso sobre Pokémon

Pokémon, seus nomes, personagens e elementos relacionados pertencem aos respectivos detentores de direitos. Este é um projeto independente, não oficial e sem vínculo com The Pokémon Company, Nintendo ou Game Freak.

Se o projeto crescer ou passar a receber monetização significativa, avalie substituir nomes, imagens e identidade visual por criaturas e assets originais e procure orientação jurídica adequada.

## 📄 Licença

Este repositório é um projeto fan-made. Antes de definir uma licença para redistribuição, verifique os direitos dos dados, imagens e demais assets utilizados.
