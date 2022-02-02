-- "name" is stored as varchar to support variable length string with 
-- no upper limit. "email" is stored in accordance with RFC 5321 and Errata 1690.
create table if not exists users(
    id uuid primary key,
    firstName varchar not null,
    lastName varchar not null,
    email varchar(319) not null,
    password bytea not null
);

create table if not exists pages(
    id uuid primary key,
    name varchar not null,
    owner uuid references users(id)
);

-- "ability" represents what the user is capable of doing with a page.
-- common values could be "editor", "viewer".
create table if not exists abilities(
    pageId uuid references pages(id),
    userId uuid references users(id),
    ability varchar not null 
);

create table if not exists blocks(
    id uuid primary key,
    pageId uuid references pages(id),
    tag varchar not null,
    html varchar not null,
    position integer not null,
    href varchar,
    src varchar
);
