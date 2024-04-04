insert into sources values (newid (), 'Dice');
insert into sources values (newid (), 'Indeed');

alter table jobs add source_id uniqueidentifier;
alter table jobs add constraint FK_jobs_to_sources foreign key (source_id) references sources (id);

select * from jobs;