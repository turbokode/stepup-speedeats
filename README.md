# [SpeedEats]

## Índice

- [\[SpeedEats\]](#speedeats)
  - [Índice](#índice)
  - [Sobre o projeto](#sobre-o-projeto)
    - [Funcionalidades principais](#funcionalidades-principais)
    - [Tecnologias utilizadas](#tecnologias-utilizadas)
  - [Como contribuir](#como-contribuir)
    - [Relatar problemas ou sugestões](#relatar-problemas-ou-sugestões)
    - [Contribuir com código](#contribuir-com-código)
  - [Licença](#licença)

## Sobre o projeto

**SpeedEats** é um app desenvolvido para agilizar a experiência de pedidos de fast food. Ele atende restaurantes e clientes, oferecendo uma plataforma fácil de usar para navegação no cardápio, colocação de pedidos, gerenciamento de entrega e processamento seguro de pagamentos.

Os restaurantes registrados podem criar e gerenciar seus cardápios, receber e atender pedidos e aceitar pagamentos. Os clientes podem navegar pelos cardápios de vários restaurantes, personalizar seus pedidos, pagar com comodidade e acompanhar suas entregas. O aplicativo também permite que usuários não registrados visualizem os restaurantes registrados e os detalhes do cardápio, promovendo a descoberta e incentivando o registro para uma experiência completa de pedido.

### Funcionalidades principais

1. **Usuários**

Tipos de usuário:

- Proprietário do restaurante (cadastro/login)
- Cliente (Cadastro/Login)
- Guest (usuário não registrado)

Cadastro:

- Os utilizadores se cadastram com nome, e-mail e password.

Login:

- Login usando e-mail e senha.
- Os utilizadores podem fazer Login com google

Gerenciamento de contas:

- Usuários registrados (proprietário e cliente do restaurante) podem editar as informações do perfil.

  - nr de telefone
  - endereco
  - localizacao para entregas
  - foto de perfil

  - Notificações instantâneas via push e SMS com informações claras e concisas sobre desastres em uma área específica, incluindo o nível de severidade, instruções e dicas de segurança.

2. **Restaurantes**

Criação de Restaurante:

- O proprietário do restaurante registra seu restaurante com detalhes como nome, endereço, localizacao, horário de funcionamento, uma breve descrição, slogan, nr de telefone, email, codigo de mpesa.
- O proprietario deve ser capaz de editar os dados do restaurante

Gerenciamento de cardápio:

- Criar, editar e excluir itens de menu.
- Detalhes dos itens de menu:
  - Nome do item, descrição, preço, imagem, tempo de preparo e lista de ingredientes
  - Os ingredientes serao selecionados a partir dos ingredientes disponiveis no app, caso um nao exista tera a opcao de criar esse novo ingrediente

3. **Pedidos**

Pedido do cliente:

- O cliente pode Navegar pelos cardápios dos restaurantes cadastrados e adicionar itens ao carrinho, com opção de personalizar as quantidades.
- O cliente pode Ver o tempo estimado de entrega e o custo.
- O cliente deve ser capaz de ver a lista de pedidos das ultimas 24hhh

Colocação de pedidos:

- Confirmação com detalhes do pedido e tempo estimado de entrega.
- Os pedidos devem ser agrupados por restaurante
- Processamento seguro de pagamentos por mpesa.

Atendimento de pedidos em restaurantes:

- Visualizar pedidos recebidos com detalhes como informações do cliente, itens do pedido.
- Marcar o pedido como entregue

4. **Usuário Guest**

- Navegar pelas listas de restaurantes com informações básicas como nome, tipo de cozinha e classificação média.
- Veja menus detalhados de restaurantes, incluindo nomes de itens, descrições e preços.

5. **Recursos adicionais**

Notificações via push:

- Alertar os restaurantes sobre novos pedidos.

Avaliações e comentários:

- Permita que os clientes avaliem os restaurantes com estrelas.

### Tecnologias utilizadas

- Backend
  - [Node.js](https://nodejs.org/)
  - TypeScript
  - [Fastify](https://fastify.dev/)
  - [Prisma](https://www.prisma.io/)
  - Postgres
  - [[Firebase]](https://firebase.google.com/docs/)
  - [Redis](https://redis.io/docs/connect/clients/nodejs/)
- Frontend
  - [ReactJS](https://react.dev/)
  - TypeScript
- Mobile
  - [React Native](https://reactnative.dev/)
  - Expo

## Como contribuir

Sua contribuição é bem-vinda! Siga os passos abaixo para colaborar com o desenvolvimento deste projeto.

### Relatar problemas ou sugestões

Se encontrar algum problema ou tiver sugestões de melhorias, por favor, abra uma **issue** neste repositório. Certifique-se de incluir informações detalhadas sobre o problema e/ou sua sugestão.

### Contribuir com código

Caso deseje contribuir diretamente com código, siga os passos abaixo:

1. Faça um fork deste repositório.
2. Crie uma nova branch para sua contribuição: `git checkout -b sua-feature`.
3. Faça as alterações desejadas.
4. Certifique-se de testar suas alterações.
5. Faça commit das suas alterações: `git commit -m "Adicione sua-feature"`.
6. Envie suas alterações para sua branch: `git push origin sua-feature`.
7. Abra um **pull request** neste repositório.

## Licença

Este projeto está sob a licença Apache V2. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
