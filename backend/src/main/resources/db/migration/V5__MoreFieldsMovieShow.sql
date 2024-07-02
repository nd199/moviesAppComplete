alter table movie
    add column description TEXT NOT NULL DEFAULT 'None';

alter table movie
    add column poster VARCHAR(255) NOT NULL DEFAULT 'None';

alter table movie
    add column year INTEGER NOT NULL DEFAULT 2000;

alter table movie
    add column runtime VARCHAR(255) NOT NULL DEFAULT 'None';

alter table movie
    add column genre TEXT NOT NULL DEFAULT 'None';

alter table show
    add column description TEXT NOT NULL DEFAULT 'None';

alter table show
    add column poster TEXT NOT NULL DEFAULT 'None';

alter table show
    add column year INTEGER NOT NULL DEFAULT 2000;

alter table show
    add column runtime VARCHAR(255) NOT NULL DEFAULT 'None';

alter table show
    add column genre TEXT NOT NULL DEFAULT 'None';