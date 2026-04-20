# Objetivo

Criar um crash game

# Como rodar

Pra rodar essa aplicação é bem simples.

1 - Crie o .env em cada um dos serviços "frotend", "games" e "wallets", use como base o que tem no
example .env de cada um.

2 - Agora é só rodar o comando abaixo e ser feliz:

```
pnpm docker:up
```

Após tudo ser criado o site vai está rodando no localhost:3000

Obs: Após finalizar o docker up espera alguns minutos pois as api's ainda vão provavelmente tá 
rodando as migrations.

Obs 2: se tiver no windows(problema no windows, quem iria imaginar :o) pode ter b.o com postgres dei uma pesquisada e esse comando no root resolve.

```
(Get-Content "docker/postgres/init-databases.sh" -Raw).Replace("`r`n","`n") | Set-Content "docker/postgres/init-databases.sh" -NoNewline
```

# Referencias que usei 

Como nunca tinha usado um tive que fazer algumas pesquisas e testes.

Usei esse vídeo 
E também joguei algumas partidas para testar nesse site (Inclusive sai no saldo positivo kkaka
ganhei 10 reais T-T)

# Arquitetura de como o jogo

Por falta de tempo fiz o jogo em memória então né, esse jogo é resenha em cloud kakaka mas enfim,
explicando a arquitetura ele funciona mais ou menos assim.

Assim que o servidor inicia a gente roda uma única instancia da engine em memoria, essa instancia
é responsavel por manipular o timer e eventos do jogo.

Essa engine roda em um loop infinito, e não congela o sistema devido ser async (Javascript constantemente sai e volta pra o loop).

Além das stacks do que foi estabelecida coloquei o redis também, minha ideia era se desse tempo usar o redis para fazer a engine persistir seus dados, mas não deu T-T

Mesmo assim ainda tô usando o redis na hora de calcular o valor do cashout, dessa forma a gente pega o timer mais preciso.

Hmmm, que ainda vale mencionar acredito que seja a arquitetura do meu ddd, que é meio diferenciada né kkkk. Pra esse projeto eu decidi seguir com algo da seguinte forma:

- Rotas de escritas que tem muitas regras de negocio a gente usa o padrãozin de entidade + repo e tals

- Rotas de leitura a gente le via query mesmo, dessa forma a gente só lê o que precisa.