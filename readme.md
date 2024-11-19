# Шаблон для создания мини-приложения на Next.js

### Что нужно установить:
- nodejs 22+ [Ссылка](https://nodejs.org/en/download/prebuilt-installer/current)
- docker [Ссылка](https://docs.docker.com/desktop/setup/install/windows-install/)


### Перед работой необходимо уметь:
Всем:
- Работать с TypeScript и понимать что такое дженерики: [Ссылка](https://www.youtube.com/watch?v=V7hBejCH1HI)
- Работать с маршрутизацией в Next.js 14: [Ссылка](https://my-js.org/docs/guide/nextjs/#%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%80%D0%BE%D1%83%D1%82%D0%BE%D0%B2) Страницы (page.tsx)
    - Макеты (layout.tsx)
    - Шаблоны можно пропустить
    - Группы путей: [Ссылка](https://my-js.org/docs/guide/nextjs/#%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D1%8B-%D1%80%D0%BE%D1%83%D1%82%D0%BE%D0%B2)
- Понимать основы zod: [Ссылка](https://habr.com/ru/articles/855734/)
- Понимать основы Trpc: [Ссылка](https://my-js.org/docs/guide/trpc)
    - useQuery
    - useMutation
    - invalidate
    - Роутеры
- Работать базово с docker и docker-compose [ссылка](https://docs.docker.com/manuals/):
    - [Dockerfile](https://doka.guide/tools/dockerfile/)
    - [docker-compose](https://ru.hexlet.io/courses/docker-basics/lessons/docker-compose/theory_unit)


Бек:
- Уметь работать с бд PgAdmin [Ссылка](https://www.pgadmin.org/)
- Понимать основы DrizzleORM: [Ссылка](https://orm.drizzle.team/docs/get-started/postgresql-new)
- Уметь работать с Telegraf: [Ссылка](https://www.youtube.com/watch?v=ssaG31RBao0)

Фронт:
- Ознакомиться с библиотекой компонентов Shadcn: [Ссылка](https://ui.shadcn.com/)
- Понимать основы react-hook-form: [Ссылка](https://react-hook-form.com/get-started)
- Понимать основы tanstack tabke: [Ссылка](https://tanstack.com/table/latest/docs/guide/tables)


### Файл .env


### Важные файлы на фронте проекта:

#### src/app/(website)/layout.tsx
Инициализируем MiniApp и добавляем в заголовок запроса [initData](https://docs.telegram-mini-apps.com/platform/init-data) 

#### src/app/(website)/admin/
Папка дла админки
- layout.tsx - проверяем наличие админки у пользователя и выводим админ панель, если пользователь администратор
- navbar.tsx - Навигация по админке
- page.tsx - В этой странице мы перенаправляем пользователя на первую страницу админки


#### src/app/(website)/admin/test
Папка для CRUD операций с таблицей test
- page.tsx - Получаем данные с бека и выводим таблицу с ними
- columns.tsx - Описание столбцов таблицы, для более удобного и быстрого вывода данных
- create.tsx - Форма создания теста с отправкой данных на бек
- delete.tsx - Диалоговое окно подтверждения удаления теста с вызовом функции на беке

#### src/app/(website)/(landing)
- layout.tsx - Макет основной части сайта
- page.tsx - Основная страница сайта, на ней мы получаем данные с бека и выводим эти данные
- navbar.tsx - Такой же навбар, как и в админке, но для пользователей



### Важные файлы на беке проекта:

#### src/env.js
Тут хранятся данные об окружении проекта (различные токены, пароли итд)

#### src/server/db/schema.ts
Схема базы данных с описанием таблиц и полей

#### src/server/telegram/index.ts
Телеграм бот на Telegraf в котором есть команда /start

#### src/server/telegram_auth.ts
Авторизация пользователя с помощью [initData](https://docs.telegram-mini-apps.com/platform/init-data) 

#### src/server/telegra/webhook.ts
Получение обновлений с api телеграмма с помощью [webhook](https://www.calltouch.ru/blog/chto-takoe-vebhuk-kak-i-zachem-ego-ispolzovat/)

#### src/server/api/trpc.ts
Смотреть в самый низ файла

#### src/server/api/main
Бек проекта
- routers/test.ts - Роутер для управления тестами
- routers/user.ts - Роутер для управлением пользователями
- index.ts Добавляет роутеры из папки routers в бек, чтобы ими можно было пользоваться

Хорошая практика - создавать по роутеру на каждую модель базы данных


### Чтобы запустить проект будет нужен домен и подключение к cloudflared
Обратитесь за доменом и подключением к Алексею
