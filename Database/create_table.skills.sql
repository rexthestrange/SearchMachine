drop table if exists skills;

create table skills (
	id uniqueidentifier not null,
	skill varchar (127)
	constraint PK_skills primary key (id)
);