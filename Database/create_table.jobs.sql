drop table if exists jobs;

create table jobs (
	id uniqueidentifier not null,
	site_job_id varchar (36),
	source_id uniqueidentifier,
	title varchar (255),
	company varchar (127),
	date_created datetime,
	constraint PK_jobs primary key (id),
	constraint FK_jobs_to_sources foreign key (source_id) references sources (id)
);

select * from jobs;