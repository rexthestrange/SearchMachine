drop table if exists applications;

create table applications (
	id uniqueidentifier not null,
	user_id uniqueidentifier not null,
	job_id uniqueidentifier not null,
	applied bit,
	date_created datetime,
	last_updated datetime,
	constraint FK_applications_to_user_accounts foreign key (user_id) references user_accounts (id),
	constraint FK_applications_to_jobs foreign key (job_id) references jobs (id)
);